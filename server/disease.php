<?php
require_once('conn.php');
$road = $_GET['road'];
$sql="select * from t_in_damagedisease where lon is not null and lat is not null limit 10";
$result=mysql_query($sql);
$results = array();
if($result){
    while($row = mysql_fetch_assoc($result)){
        $results[] = $row;
    }
}
echo json_encode($results);

?>