INSERT INTO `profi_audit`.`user`
SELECT
	`u`.`id`
	,`u`.`lastname`
	,`u`.`name`
	,if(`u`.`sex` is null,null,(if(`u`.`sex`=1,'male','female'))) AS `gender`
	,TIMESTAMPDIFF(YEAR,CONCAT_WS('-',YEAR(`u`.`birthday`),IF(MONTH(`u`.`birthday`),MONTH(`u`.`birthday`),'01'),IF(DAY(`u`.`birthday`),DAY(`u`.`birthday`),'01')),CURDATE()) AS `age`
	,`u`.`city`
	,CONCAT('{"0":"',`u`.`phone`,'"}') AS `phones`
	,`u`.`karma`
	,'' AS `extra`
FROM	`profi_research`.`user` AS `u`
WHERE	`u`.`id`		IN	(999999);

INSERT INTO `profi_audit`.`answer`
SELECT	`s`.`user`,`s`.`research` AS `poll`,`a`.`question`,`a`.`answer`
FROM	`profi_research`.`survey`			AS `s`
JOIN	`profi_audit`.`user`				AS `u` ON (`u`.`id`=`s`.`user`)
JOIN	`profi_research`.`survey_answer`	AS `a` ON (`a`.`research`=`s`.`research` AND `a`.`user`=`s`.`user`)
WHERE	`s`.`research`	=	5555	#если нужно более 1 опроса - то выполнять в 2 запроса!
AND		`a`.`question`	IN	(666);