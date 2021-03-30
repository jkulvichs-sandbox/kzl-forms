<?php
    $user = $POST["user"];
    $date = date("m_d_y_H_i_s");

    $filename = "$user_$date.json";
    $body = file_get_contents('php://input');

    if (!file_exists("results")) {
        mkdir("results", 0777, true);
    }

    file_put_contents("results/$filename", $body);
?>
