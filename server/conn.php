<?php
/*****************************
*数据库连接
*****************************/
$dbhost  = '127.0.0.1:3306';
$dbuser  = 'root';  //你的mysql用户名
$dbpass  = 'xxg111063053';  //你的mysql密码
$dbname  = 'repair0615';    //你的mysql库名
$link = mysql_connect($dbhost,$dbuser,$dbpass);
if (!$link){
    die("连接数据库失败：" . mysql_error());
}
mysql_select_db($dbname, $link);
//字符转换，读库
mysql_query("set character set 'utf8'");
//写库
mysql_query("set names 'utf8'");
?>