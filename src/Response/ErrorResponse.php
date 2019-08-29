<?php
namespace ZemaTreeBundle\Response;


class ErrorResponse
{
    protected static $errors = [
        'node_not_found' => 'Не удалось найти объект'
    ];
    public static function getError($name)
    {
        return [
            'error' => self::$errors[$name] ?? 'Ошибка'
        ];
    }
}