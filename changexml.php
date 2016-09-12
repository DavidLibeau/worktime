<?php
if(isset($_GET["data"])){
    $fp = fopen("bdd2.xml", "w");
    fwrite($fp,$_GET["data"]);
    fclose($fp);
    
    echo("Done");
}
?>