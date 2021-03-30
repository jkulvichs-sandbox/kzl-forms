<?php
// Saves base64 to file
function base64_to_file($base64_string, $output_file)
{
    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode(',', $base64_string);

    // parsing mime type
    $ext = [
        "data:audio/wav;base64" => "wav",
        "data:image/jpeg;base64" => "jpg",
        "data:image/bmp;base64" => "bmp",
        "data:image/gif;base64" => "gif",
        "data:image/png;base64" => "png",
        "data:application/pdf;base64" => "pdf",
        "data:audio/mpeg;base64" => "mp3",
        "data:video/mp4;base64" => "mp4",
        "data:video/mpeg;base64" => "mpeg",
        "data:audio/ogg;base64" => "ogg",
        "data:application/msword;base64" => "doc",
        "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64" => "docx",
        "data:application/vnd.oasis.opendocument.text;base64" => "odt",
        "data:application/vnd.ms-powerpoint;base64" => "ppt",
        "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64" => "pptx",
        "data:application/vnd.rar;base64" => "rar",
        "data:application/rtf;base64" => "rtf",
        "data:image/svg+xml;base64" => "svg",
        "data:application/vnd.ms-excel;base64" => "xls",
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64" => "xlsx",
        "data:application/zip;base64" => "zip",
        "data:application/x-7z-compressed;base64" => "7z",
    ][$data[0]];
    if (empty($ext)) $ext = "file";

    $rnd = rand(1000, 9999);
    $filename = "$output_file-$rnd.$ext";

    // open the output file for writing
    $ifp = fopen($filename, "wb");

    // we could add validation here with ensuring count( $data ) > 1
    fwrite($ifp, base64_decode($data[1]));

    // clean up the file resource
    fclose($ifp);

    return $filename;
}

$user = empty($_REQUEST["user"]) ? "unknown" : $_REQUEST["user"];
$date = date("m_d_y_H_i_s");
$rnd = rand(1000, 9999);
$filetag = "$user-$date-$rnd";

$filename = "$filetag.json";
$body = file_get_contents('php://input');

// Creating folders if doesn't exists
if (!file_exists("results")) {
    mkdir("results", 0777, true);
}
if (!file_exists("results/media")) {
    mkdir("results/media", 0777, true);
}

// Form parsing
$form = json_decode($body, true);

// Going through form's blocks and saves all files
for ($iblock = 0; $iblock < count($form["blocks"]); $iblock++) {
    // Save voice and replace data to filename
    if ($form["blocks"][$iblock]["type"] === "voice") {
        $mediafile = base64_to_file($form["blocks"][$iblock]["data"]["data"], "results/media/$filetag");
        $form["blocks"][$iblock]["data"]["data"] = $mediafile;
    }
    // Save files and replace by paths
    if ($form["blocks"][$iblock]["type"] === "file") {
        for ($ifile = 0; $ifile < count($form["blocks"][$iblock]["data"]["files"]); $ifile++) {
            $mediafile = base64_to_file($form["blocks"][$iblock]["data"]["files"][$ifile], "results/media/$filetag");
            $form["blocks"][$iblock]["data"]["files"][$ifile] = $mediafile;
        }
    }
}

// Saving results
file_put_contents("results/$filename", json_encode($form, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
?>
