export function enc(S: string, iter: number) {
	const len = S.length;
	const res = new Array(S.length).fill("");
	// oeoeoe
	const middle = Math.floor(len / 2);

	// for (let index = 0; index < S.length; index++) {
	// 	const letra = S[index];
	// 	if (index % 2 == 0) {
	// 		res[middle] = letra;
	// 		middle++;
	// 	} else {
	// 		res[left] = letra;
	// 		left++;
	// 	}
	// }

	const par = middle;
	const impar = -1;

	/**
	 *  input					output		moves													(len:half) diff
	 *  0 1 			-> 1 0
	 *													1 -1													(2:1)		0	-2
	 * 	0 1 2 		-> 1 0 2
	 * 													1 -1 0												(3:1.5)	0	-2 1
	 * 0 1 2 3		-> 1 3 0 2
	 * 													2 -1 1 -2											(4:2)		0	-3 	2 -3
	 * 0 1 2 3 4	-> 1 3 0 2 4
	 * 													2 -1 1 -2 0										(5:2.5)	0 -3	2	-3	2
	 * 0 1 2 3 4 5-> 1 3 5 0 2 4
	 * 													3 -1 2 -2 1 -3								(6:3)		0	-4 	3	-4	3	-4
	 * 0123456		-> 1 3 5 0 2 4 6
	 * 													3 -1 2 -2 1 -3 0							(7:3.5)	0	-4	3	-4	3	-4	3
	 * 													4 -1 3 -2 2 -3 1 -4						(8:4)		0	-5	4	-5	4	-5	4 -5
	 * 													4 -1 3 -2 2 -3 1 -4 0					(9:4.5)	0	-5	4	-5	4	-5	4	-5 	4
	 * 													5 -1 4 -2 3 -3 2 -4 1 -5			(10:5)	0 -6	5	-6	5	-6	5	-6	5	-6
	 * 													5 -1 4 -2 3 -3 2 -4 1 -5 0						0 -6	5	-6	5	-6	5	-6	5	-6	5
	 *
	 *
	 * 	example 1:
	 *  0	1 2	3	4	5, 1
	 *  half: 3
	 * 	3		(3 - 4) (-1 + 3) (2 - 4) (-2 + 3)	(1 - 4)
	 * 	3		-1			2					-2			1				-3
	 *
	 * 	iter: 1 -> 1	3	5	0	2	4
	 * 	iter: 2 -> 1[3]	3[-1]	5[2]	0[-2]	2[1]	4[-3]	->	3 0 4 1 5 2
	 *
	 */
	const moves = new Array(S.length).fill(middle);
	let move = middle;
	for (let index = 1; index < moves.length; index++) {
		if (index % 2 == 1) {
			move = move - (middle + 1);
			moves[index] = move;
		} else {
			move = move + middle;
			moves[index] = move;
		}
	}

	// eeeooo
	console.log({ res, moves });
	return res.join("");
}
