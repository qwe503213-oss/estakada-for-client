<?php
// ===================================
// ООО "ЭСТАКАДА" - Обработка форм
// ===================================

// Подключаем конфигурацию
require_once 'config.php';

// Заголовок для JSON-ответа
header('Content-Type: application/json; charset=UTF-8');

// ===================================
// ПРОВЕРКА МЕТОДА ЗАПРОСА
// ===================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// ===================================
// ПОЛУЧЕНИЕ И ОЧИСТКА ДАННЫХ
// ===================================
function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$type = isset($_POST['type']) ? sanitizeInput($_POST['type']) : '';
$company = isset($_POST['company']) ? sanitizeInput($_POST['company']) : '';
$inn = isset($_POST['inn']) ? sanitizeInput($_POST['inn']) : '';
$contact = isset($_POST['contact']) ? sanitizeInput($_POST['contact']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// ===================================
// ВАЛИДАЦИЯ
// ===================================
// Очищаем телефон от лишних символов
$phone = preg_replace('/[^0-9+]/', '', $phone);

if (empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Телефон обязателен']);
    exit;
}

// Валидация email (если указан)
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Некорректный email']);
    exit;
}

// ===================================
// ФОРМИРОВАНИЕ ПИСЬМА
// ===================================
$subject = 'Новая заявка с сайта ЭСТАКАДА';
$subject .= $company ? ' (B2B)' : '';

$body = "=== НОВАЯ ЗАЯВКА ===\n\n";
$body .= "Дата: " . date('d.m.Y H:i') . "\n";
$body .= "Тип: " . ($company ? 'Юридическое лицо' : 'Физическое лицо') . "\n\n";

if ($company) {
    $body .= "Организация: {$company}\n";
    $body .= "ИНН: {$inn}\n";
    $body .= "Контактное лицо: {$contact}\n";
    $body .= "Email: {$email}\n";
} else {
    $body .= "Имя: {$name}\n";
    $body .= "Тип объекта: {$type}\n";
}

$body .= "\nТелефон: {$phone}\n";
$body .= "Сообщение: {$message}\n";
$body .= "\n=== КОНЕЦ ЗАЯВКИ ===";

// ===================================
// ЗАГОЛОВКИ ПИСЬМА (защита от инъекций)
// ===================================
$fromEmail = defined('EMAIL_FROM') ? EMAIL_FROM : 'no-reply@estakada.ru';
$siteName = defined('SITE_NAME') ? SITE_NAME : 'ЭСТАКАДА';

// Экранируем заголовки от инъекций
$safeEmail = preg_replace('/[\r\n]/', '', $email);
$safeFrom = preg_replace('/[\r\n]/', '', $fromEmail);

$headers = "From: {$siteName} <{$safeFrom}>\r\n";
$headers .= "Reply-To: {$safeEmail}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// ===================================
// ОТПРАВКА НА EMAIL
// ===================================
$emailSent = false;
if (defined('EMAIL_CONTACT') && !empty(EMAIL_CONTACT)) {
    $emailSent = mail(EMAIL_CONTACT, $subject, $body, $headers);
}

// ===================================
// ОТПРАВКА В TELEGRAM (опционально)
// ===================================
$telegramSent = false;

// Настройки Telegram (заполните перед использованием)
$telegramToken = defined('TELEGRAM_BOT_TOKEN') ? TELEGRAM_BOT_TOKEN : '';
$telegramChatId = defined('TELEGRAM_CHAT_ID') ? TELEGRAM_CHAT_ID : '';

if (!empty($telegramToken) && !empty($telegramChatId)) {
    $telegramText = "📨 *Новая заявка с сайта*\n\n";
    $telegramText .= $company ? "*Тип:* Юр. лицо\n*Организация:* {$company}\n*ИНН:* {$inn}\n*Контакт:* {$contact}\n" : "*Тип:* Физ. лицо\n*Имя:* {$name}\n";
    $telegramText .= "*Телефон:* `{$phone}`\n";
    if (!empty($email)) $telegramText .= "*Email:* `{$email}`\n";
    if (!empty($type)) $telegramText .= "*Объект:* {$type}\n";
    if (!empty($message)) $telegramText .= "*Сообщение:* {$message}\n";
    $telegramText .= "\n📅 " . date('d.m.Y H:i');
    
    $telegramData = [
        'chat_id' => $telegramChatId,
        'text' => $telegramText,
        'parse_mode' => 'MarkdownV2'
    ];
    
    // Используем cURL для надёжности
    $ch = curl_init('https://api.telegram.org/bot' . $telegramToken . '/sendMessage');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($telegramData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $telegramSent = true;
    }
}

// ===================================
// ФОРМИРОВАНИЕ ОТВЕТА
// ===================================
if ($emailSent || $telegramSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Заявка успешно отправена'
    ]);
} else {
    // Логируем ошибку (опционально)
    // error_log("Send error: emailSent=" . ($emailSent ? '1' : '0') . ", telegramSent=" . ($telegramSent ? '1' : '0'));
    
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка отправки. Пожалуйста, позвоните нам.'
    ]);
}

exit;
?>