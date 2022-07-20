let arr = [];		
for(let i = 0; i < 9; i++){
	const row = [];
	for(let j = 0; j < 9; j++){
		row.push((Math.floor(i * 3 + i / 3 + j) % (3 * 3) + 1));
	}
	arr.push(row);
}

const swap_rows = () => {
	for(let i = 0; i < 3; i ++){
		let [min, max] = [i * 3, i * 3 + 2];
		let [l1, l2] = [0, 0];
		while (l1 == l2){
			l1 = getRandom(min, max);
			l2 = getRandom(min, max);
		}
		const tmpLine = arr[l1];
		arr[l1] = arr[l2];
		arr[l2] = tmpLine;
	}
}

const swap_rows_big = () => {
	let [l1, l2] = [0, 0];
	while (l1 == l2){
		l1 = getRandom(0, 2);
		l2 = getRandom(0, 2);
	}
	const tmp = [
		arr[l1 * 3], 
		arr[l1 * 3 + 1], 
		arr[l1 * 3 + 2]
	];
	arr[l1 * 3] = arr[l2 * 3];
	arr[l1 * 3 + 1] = arr[l2 * 3 + 1];
	arr[l1 * 3 + 2] = arr[l2 * 3 + 2];
	arr[l2 * 3] = tmp[0];
	arr[l2 * 3 + 1] = tmp[1];
	arr[l2 * 3 + 2] = tmp[2];
}

const swap_colls = () => {
	for(let i = 0; i < 3; i ++){
		const [min, max] = [i * 3, i * 3 + 2];
		let [c1, c2] = [0, 0];
		while (c1 == c2){
			c1 = getRandom(min, max);
			c2 = getRandom(min, max);
		}
		for(let j = 0; j < arr.length; j++){
			const tmp = arr[j][c1];
			arr[j][c1] = arr[j][c2];
			arr[j][c2] = tmp;
		}
	}
}

const swap_colls_big = () => {
	let [c1, c2] = [0, 0];
	while (c1 == c2){
		c1 = getRandom(0, 2);
		c2 = getRandom(0, 2);
	}
	const tmp = [];
	for(let i = 0; i < 9; i++){
		const t = [arr[i][c1 * 3], arr[i][c1 * 3 + 1], arr[i][c1 * 3 + 2]]
		tmp.push(t);
	}
	for(let i = 0; i < 9; i++){
		arr[i][c1 * 3] = arr[i][c2 * 3];
		arr[i][c1 * 3 + 1] = arr[i][c2 * 3 + 1];
		arr[i][c1 * 3 + 2] = arr[i][c2 * 3 + 2];
	}
	for(let i = 0; i < 9; i++){
		arr[i][c2 * 3] = tmp[i][0];
		arr[i][c2 * 3 + 1] = tmp[i][1];
		arr[i][c2 * 3 + 2] = tmp[i][2];
	}
}

const getRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const shuffle = () => {
	const fn = [swap_colls, swap_rows, swap_colls_big, swap_rows_big];
	for(let i = 0; i < 20; i++){
		const k = getRandom(0, fn.length - 1);
		fn[k]();
	}
}

const showSudoku = () => {
	let sudoku = [];
	for(let rowBig = 0; rowBig < 3; rowBig++){
		sudoku.push('<div class="row-big">');
		for(let cellBig = 0; cellBig < 3; cellBig++){
			sudoku.push('<div class="cell-big">');
			for(let rowSmall = 0; rowSmall < 3; rowSmall++){
				sudoku.push('<div class="row-small">');
				for(let cellSmall = 0; cellSmall < 3; cellSmall++){
					sudoku.push(addField((rowBig * 3 + rowSmall), (cellBig * 3 + cellSmall), arr[(rowBig * 3 + rowSmall)][(cellBig * 3 + cellSmall)], getRandom(0, 1)));
				}
				sudoku.push('</div>');
			}
			sudoku.push('</div>');
		}
		sudoku.push('</div>');
	}
	document.getElementById("field").innerHTML = sudoku.join('');
}

const addField = (x, y, value, filled) => {
	return `<div class="cell-small ${ filled ? 'locked' : 'attempt' }" id="${x}_${y}" data-cords="${x}_${y}">${filled ? value : '&nbsp;'}</div>`
}		

document.addEventListener("click", function(e){
	const digits = document.querySelector("#digits");
	if(!e.target.classList.contains("attempt")){
		digits.style.display = "none";
	}
	if(e.target.classList.contains("cell-small")){
		const active = document.querySelector(".cell-small.active");
		if(active != null && active.classList != undefined){
			active.classList.remove("active");
		}
		highLight(e.target.dataset.cords);
	}
	if(e.target.classList.contains("attempt")){
		e.target.classList.add("active");				
		let x = (e.target.offsetLeft - 233);
		let y = (e.target.offsetTop + 45);
		x = (x > 0) ? x : 0;				
		digits.style.top = `${y}px`;
		digits.style.left = `${x}px`;
		digits.style.display = "block";
	}
	if(e.target.classList.contains("digit")){
		const digit = e.target.dataset.digit;
		const cell = document.querySelector(".cell-small.active");
		if(cell != null){
			const cords = cell.dataset.cords.split("_");
			if(digit == arr[cords[0]][cords[1]]){
				cell.classList.remove("wrong", "active", "attempt");
				digits.style.display = "none";
				cell.innerHTML = digit;
				cell.classList.add("locked");
			}else{
				cell.innerHTML = digit;
				cell.classList.add("wrong");
			}
		}
	}
	recountSolved();
});

const highLight = (cords) => {
	clearHovered();
	cords = cords.split("_");
	for(let i = 0; i < 9; i++){
		document.getElementById(`${cords[0]}_${i}`).classList.add("hovered");
		document.getElementById(`${i}_${cords[1]}`).classList.add("hovered");
	}
}

const clearHovered = () => {
	const els = document.querySelectorAll(".hovered");
	els.forEach((el) => {
		el.classList.remove('hovered');
	});
}

const recountSolved = () => {
	const solved = document.getElementsByClassName("locked");
	if(solved.length == 81){
		solvedMessage();
	}
}

const solvedMessage = () => {
	document.getElementById("field").innerHTML += "<div style='position: absolute; left: 0; top: 99px; width: 237px; height: 40px; line-height: 40px; color: white; text-align: center; font-weight: bold; background-color: green; z-index: 300;'>SOLVED</div>";
}

document.addEventListener("DOMContentLoaded", function(){
	shuffle();
	showSudoku();
});