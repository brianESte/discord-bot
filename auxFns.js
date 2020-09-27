// auxillary functions

// convert a flake (id) to binary and split it into the relevant sections
const flake2bin = (snow) => {
	// documentation example: 266241948824764416
	var binarry = [];
	for(var b = 0; b < 64; b++){
		binarry.unshift(snow%2);
		snow = Math.floor(snow/2);
	}
	var sections = [binarry.slice(0,-22).join(''),
					binarry.slice(-22,-17).join(''),
					binarry.slice( -17,-12).join(''),
					binarry.slice(-12).join('')];
	
	console.log(sections.join(' '));
	return sections
}