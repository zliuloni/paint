goog.require('X.renderer3D');
goog.require('X.renderer2D');
goog.require('X.mesh');
goog.require('X.matrix');
goog.require('X.volume');
goog.require('X.cube');

/**
 * Setup all UI elements once the loading was completed.
 */
function setupUi() {
	
  // VOLUME
  if (_data.volume.file != null) {
    
    // update threshold slider
    jQuery('#threshold-volume').dragslider("option", "max", volume.max);
    jQuery('#threshold-volume').dragslider("option", "min", volume.min);
    jQuery('#threshold-volume').dragslider("option", "values",
        [4, volume.max]);
    volume.lowerThreshold = 4;
    
    // update window/level slider
    jQuery('#windowlevel-volume').dragslider("option", "max", volume.max);
    jQuery('#windowlevel-volume').dragslider("option", "min", volume.min);
    jQuery('#windowlevel-volume').dragslider("option", "values",
        [volume.min, volume.max]);
    
    // update 3d opacity
    jQuery('#opacity-volume').slider("option", "value", 5);
    volume.opacity = 0.05; // re-propagate
    volume.modified();
    
    // update 2d slice sliders
    var dim = volume.dimensions;
    jQuery("#yellow_slider").slider("option", "disabled", false);
    jQuery("#yellow_slider").slider("option", "min", 0);
    jQuery("#yellow_slider").slider("option", "max", dim[0] - 1);
    jQuery("#yellow_slider").slider("option", "value", volume.indexX);
    jQuery("#red_slider").slider("option", "disabled", false);
    jQuery("#red_slider").slider("option", "min", 0);
    jQuery("#red_slider").slider("option", "max", dim[1] - 1);
    jQuery("#red_slider").slider("option", "value", volume.indexY);
    jQuery("#green_slider").slider("option", "disabled", false);
    jQuery("#green_slider").slider("option", "min", 0);
    jQuery("#green_slider").slider("option", "max", dim[2] - 1);
    jQuery("#green_slider").slider("option", "value", volume.indexZ);
    
    jQuery('#volume .menu').removeClass('menuDisabled');
    
	jQuery('#volume .menu').stop().animate({
	 'marginLeft': '-2px'
	}, 1000);
	has_volume = true;
    
  } else {
    
    if (!has_volume) {
	    // no volume
	    jQuery('#volume .menu').addClass('menuDisabled');
	    jQuery("#yellow_slider").slider("option", "disabled", true);
	    jQuery("#red_slider").slider("option", "disabled", true);
	    jQuery("#green_slider").slider("option", "disabled", true);
    }
	
  }
  
  // LABELMAP always there
  jQuery('#labelmapSwitch').show();
    
  jQuery('#opacity-labelmap').slider("option", "value", 60);
  volume.labelmap.opacity = 0.6; // re-propagate
    

  // MESH
  if (_data.mesh.file != null) {
    
    jQuery('#opacity-mesh').slider("option", "value", 100);
    mesh.opacity = 1.0; // re-propagate
    
    mesh.color = [0, 0, 1];
    
    jQuery('#mesh .menu').removeClass('menuDisabled');
    
	jQuery('#mesh .menu').stop().animate({
	 'marginLeft': '-2px'
	}, 1000);
	has_mesh = true;
    
  } else {
    
    if (!has_mesh) {
	    // no mesh
	    jQuery('#mesh .menu').addClass('menuDisabled');
    }
  
  }
//   
  // // SCALARS
  // if (_data.scalars.file != null) {
//     
    // var combobox = document.getElementById("scalars-selector");
    // combobox.value = 'Scalars 1';
//     
    // jQuery("#threshold-scalars").dragslider("option", "disabled", false);
    // jQuery("#threshold-scalars").dragslider("option", "min",
        // mesh.scalars.min * 100);
    // jQuery("#threshold-scalars").dragslider("option", "max",
        // mesh.scalars.max * 100);
    // jQuery("#threshold-scalars").dragslider("option", "values",
        // [mesh.scalars.min * 100, mesh.scalars.max * 100]);
//     
  // } else {
//     
    // var combobox = document.getElementById("scalars-selector");
    // combobox.disabled = true;
    // jQuery("#threshold-scalars").dragslider("option", "disabled", true);
//     
  // }
  
  // FIBERS
  if (_data.fibers.file != null) {
    
    jQuery('#fibers .menu').removeClass('menuDisabled');
    
    jQuery("#threshold-fibers").dragslider("option", "min", fibers.scalars.min);
    jQuery("#threshold-fibers").dragslider("option", "max", fibers.scalars.max);
    jQuery("#threshold-fibers").dragslider("option", "values",
        [fibers.scalars.min, fibers.scalars.max]);
	jQuery('#fibers .menu').stop().animate({
	 'marginLeft': '-2px'
	}, 1000);
	has_fibers = true;
    
  } else {
    
    if (!has_fibers) {
	    // no fibers
	    jQuery('#fibers .menu').addClass('menuDisabled');
    }
    
  }
  
  	// Set up initial color
	// var elem = document.getElementById('colorId');
	// elem.value = losp_slices._brush._colorid;

	// var colors = volume.labelmap._colortable._map.get(losp_slices._brush._colorid);

	// if (colors == null) {
		// document.getElementById("labelName").innerHTML = "Error: Does not exist";
		// return;
	// }

	// var name = colors[0];
	// var red = colors[1] * 255.0;
	// var green = colors[2] * 255.0;
	// var blue = colors[3] * 255.0;
	// var trans = colors[4] * 255.0;

	// elem.style.backgroundColor = "rgba(" + red + "," + green + "," + blue + "," + trans + ")";
	// document.getElementById("labelName").innerHTML = name;


	_current_3d_content = ren3d;
  	_current_X_content = sliceX;
 	_current_Y_content = sliceY;
  	_current_Z_content = sliceZ;

	// Set up slice number
	document.getElementById('sliceXText').innerHTML = "Sagittal slice number: " + Math.floor(jQuery('#yellow_slider').slider("option", "value"));
	document.getElementById('sliceYText').innerHTML = "Coronal slice number: " + Math.floor(jQuery('#red_slider').slider("option", "value"));
	document.getElementById('sliceZText').innerHTML = "Axial slice number: " + Math.floor(jQuery('#green_slider').slider("option", "value"));
	
	// Set initial paint brush size
	var e = document.getElementById('paintBrushSize');
	var selectedView = e.options[e.selectedIndex].value;
	losp_slices._brush._size = selectedView;

	// Initialize undo stack
 	//losp_addUndoRedo('U', volume._labelmap);
 	
	losp_updateCurrent(volume._labelmap);
	
	var slicen = Math.floor(volume.indexX);
	jQuery("#copyFromNum").val(slicen);
	jQuery("#copyToNum").val(slicen+1);
}

function volumerenderingOnOff(bool) {

  if (!volume) {
    return;
  }
  
  volume.volumeRendering = bool;
  

}

function labelVolumeToShape(visible) {
	
  if (!volume || !volume._labelmap) {
    return;
  }
  
  if (visible) {
  	var x_width = volume._labelmap._dimensions[0];
	var y_width = volume._labelmap._dimensions[1];
	var z_width = volume._labelmap._dimensions[2];
	
	// prepare a 3d array to remember if a point is visited
	for (var zi=0; zi < z_width; zi++) {
		var arrayy = new Array();
		for (var yi=0; yi < y_width; yi++) {
			var arrayx = new Array();
			for (var xi=0; xi < x_width; xi++) {
				arrayx[xi] = false;
			}
			arrayy[yi] = arrayx;
		}
		volume._labelmap._visited[zi] = arrayy;
	}
	
	// find out a point inside the region
	var x,y,z=0, intensity;
	for (var i=0; i < x_width; i++) {
		for (var j=0; j < y_width; j++) {
			for (var k=0; k < z_width; k++) {
				if (volume._labelmap._image[i][j][k] > 1) {
					x = i;
					y = j;
					z = k;
					intensity = volume._labelmap._image[i][j][k];
					break;
				}
			}
			if (z > 0)	{	break;	}
		}
		if (z > 0)	{	break;	}
	}
	
	var mesh = new X.mesh();
	var _points = mesh._points = new X.triplets(10000);
	var _normals = mesh._normals = new X.triplets(10000);
	
	findSurfaces(x, y, z, intensity, _points, _normals);
	window.console.log(i + " " + j + " " + k + " " + intensity + "  "+ _points.length+ "  "+ _normals.length);
	
	ren3d.add(mesh);
	
  	mesh._type = X.displayable.types.TRIANGLES;
  	
	X.TIMERSTOP(this._classname + '.ctrller');
	  
	  // the object should be set up here, so let's fire a modified event
	  var modifiedEvent = new X.event.ModifiedEvent();
	  modifiedEvent._object = mesh;
	  modifiedEvent._container = mesh;
	  ren3d.onModified(modifiedEvent);
  }
  window.console.log(volume);
}

function findSurfaces(x, y, z, intensity, points, normals) {
	var queue=new Queue();
	var pos = [x, y, z];
	queue.enqueue(pos);
	
	while (!queue.isEmpty()) {
		
		var curr=queue.dequeue();
		x=curr[0];
		y=curr[1];
		z=curr[2];
		
		// make sure it's only visited once
		if (volume._labelmap._visited[x][y][z]) {
			continue;
		}
		volume._labelmap._visited[x][y][z] = true;
	
		// a voxel is represented as a cube
		var pa = [x+0.5, y-0.5, z+0.5];
		var pb = [x+0.5, y+0.5, z+0.5];
		var pc = [x+0.5, y+0.5, z-0.5];
		var pd = [x+0.5, y-0.5, z-0.5];
		var pe = [x-0.5, y-0.5, z+0.5];
		var pf = [x-0.5, y+0.5, z+0.5];
		var pg = [x-0.5, y+0.5, z-0.5];
		var ph = [x-0.5, y-0.5, z-0.5];
	
		// only store a surface of a cube if it is on the border
		if (x+1 >= volume._labelmap._dimensions[0] 
			|| volume._labelmap._image[x+1][y][z] != intensity) {
			// add x+1 face
			addTriangle(pa,pb,pc, points, normals);
			addTriangle(pa,pd,pc, points, normals);
		} else {
			var pos = [x+1, y, z];
			queue.enqueue(pos);
		}
	
		if (x-1 < 0 || volume._labelmap._image[x-1][y][z] != intensity) {
			// add x-1 face
			addTriangle(pf,pg,pe, points, normals);
			addTriangle(ph,pg,pe, points, normals);
		} else {
			var pos = [x-1, y, z];
			queue.enqueue(pos);
		}
	
		if (y+1 >= volume._labelmap._dimensions[1] 
			|| volume._labelmap._image[x][y+1][z] != intensity) {
			// add y+1 face
			addTriangle(pf,pg,pc, points, normals);
			addTriangle(pf,pb,pc, points, normals);
		} else {
			var pos = [x, y+1, z];
			queue.enqueue(pos);
		}
		
		if (y-1 < 0 || volume._labelmap._image[x][y-1][z] != intensity) {
			// add y-1 face
			addTriangle(pe,ph,pd, points, normals);
			addTriangle(pe,pa,pd, points, normals);
		} else {
			var pos = [x, y-1, z];
			queue.enqueue(pos);
		}
		
		if (z+1 >= volume._labelmap._dimensions[2] 
			|| volume._labelmap._image[x][y][z+1] != intensity) {
			// add z+1 face
			addTriangle(pe,pf,pb, points, normals);
			addTriangle(pe,pa,pb, points, normals);
		} else {
			var pos = [x, y, z+1];
			queue.enqueue(pos);
		}
		
		if (z-1 < 0 || volume._labelmap._image[x][y][z-1] != intensity) {
			// add z-1 face
			addTriangle(ph,pg,pc, points, normals);
			addTriangle(ph,pd,pc, points, normals);
		} else {
			var pos = [x, y, z-1];
			queue.enqueue(pos);
		}
	}
}

function addTriangle(p1, p2, p3, points, normals) {
  	points.add(p1[0], p1[1], p1[2]);
  	points.add(p2[0], p2[1], p2[2]);
  	points.add(p3[0], p3[1], p3[2]);
  	
  	// find normal
  	var ux = p2[0] - p1[0];
  	var uy = p2[1] - p1[1];
  	var uz = p2[2] - p1[2];
  	var vx = p3[0] - p1[0];
  	var vy = p3[1] - p1[1];
  	var vz = p3[2] - p1[2];
  	var cx = uy*vz - uz*vy;
  	var cy = uz*vx - ux*vz;
  	var cz = ux*vy - uy*vx;
  	var dist = Math.sqrt(Math.pow(cx, 2) + Math.pow(cy, 2) + Math.pow(cz, 2));
  	var nx = cx/dist;
  	var ny = cy/dist;
  	var nz = cz/dist;
  	normals.add(nx, ny, nz);
  	normals.add(nx, ny, nz);
  	normals.add(nx, ny, nz);
}

function thresholdVolume(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.lowerThreshold = ui.values[0];
  volume.upperThreshold = ui.values[1];
  

}

function windowLevelVolume(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.windowLow = ui.values[0];
  volume.windowHigh = ui.values[1];
  

}

function opacity3dVolume(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.opacity = ui.value / 100;
  

}

function volumeslicingX(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.indexX = ui.value;
  
  document.getElementById('sliceXText').innerHTML = "Sagittal slice number: " 
  	+ volume.indexX;
  	
}

function volumeslicingY(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.indexY = ui.value;
  
  // For showing current slide number
  document.getElementById('sliceYText').innerHTML = "Coronal slice number: " 
  	+ volume.indexY;
}

function volumeslicingZ(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.indexZ = ui.value;
  
  // For showing current slide number
  document.getElementById('sliceZText').innerHTML = "Axial slice number: " 
  	+ volume.indexZ;
}

function fgColorVolume(hex, rgb) {

  if (!volume) {
    return;
  }
  
  volume.maxColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  

}

function bgColorVolume(hex, rgb) {

  if (!volume) {
    return;
  }
  
  volume.minColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  

}

function currentBackground(hex, rgb) {
	$("#3d").css('background-color',hex);
	//$("#viewer").css('background-color',hex);
	$("#sliceX").css('background-color',hex);
	$("#sliceY").css('background-color',hex);
	$("#sliceZ").css('background-color',hex);
	//$(".menu").css('background-color',hex);
}


//
// LABELMAP
//
function opacityLabelmap(event, ui) {

  if (!volume) {
    return;
  }
  
  volume.labelmap.opacity = ui.value / 100;
  

}

function toggleLabelmapVisibility() {

  if (!volume) {
    return;
  }
  
  volume.labelmap.visible = !volume.labelmap.visible;

}

////////////////////////////////////////////////
// TODO: Additional Options
////////////////////////////////////////////////

// function colorIdChange() {
// 	
	// if (!volume) {
		// return;
	// }
// 	
	// var elem = document.getElementById('colorId');
	// var input = elem.value;
// 	
	// if (input == '') {
		// return;
	// }
// 	
	// var colors = volume.labelmap._colortable._map.get(input);
// 	
	// if (colors == null) {
		// document.getElementById("labelName").innerHTML = "Error: Does not exist";
		// return;
	// }
// 	
	// var name =  colors[0];
	// var red =   colors[1]*255.0;
	// var green = colors[2]*255.0;
	// var blue =  colors[3]*255.0;
	// var trans = colors[4]*255.0;
// 	
	// elem.style.backgroundColor = "rgba(" + red + "," + green + "," + blue + "," + trans + ")";
	// document.getElementById("labelName").innerHTML = name;
// 	
	// // Set id to appropriate color
	// losp_slices._brush._colorid = input;
// }



function paintBrushSize() {
	
	if (!volume) {
		return;
	}
	
	var e = document.getElementById('paintBrushSize');
	var selectedView = e.options[e.selectedIndex].value;
	losp_slices._brush._size = selectedView;
}

function usedColors() {
	if(!volume)	{
		return;
	}
	selectedValue = $('#favColors').val();
	rgbaColor = selectedValue.split(",");
	var rgba = {};
	rgba.r = parseInt(rgbaColor[0]);
	rgba.g = parseInt(rgbaColor[1]);
	rgba.b = parseInt(rgbaColor[2]);
	rgba.a = undefined;
	var rgbaColor = [rgba.r, rgba.g, rgba.b, rgba.a];
	
	losp_slices._brush._color = rgbaColor;
	var hexColor = ((1 << 24) + (rgba.r << 16) + (rgba.g << 8) + rgba.b).toString(16).substr(1);
	$("#favColors").css({'background-color': '#'+hexColor});
	$('#brushColor').miniColors('value','#' + hexColor);
}

function toggleUndoOption() {

	if (!volume) {
		return;
	}
	
	losp_performUndoRedo(true, volume._labelmap);
}

function toggleRedoOption() {

	if (!volume) {
		return;
	}

	losp_performUndoRedo(false, volume._labelmap);
}

function brushColor(hex, rgba) {

	if (!volume) {
		return;
	}
	var rgbaColor = [rgba.r, rgba.g, rgba.b, rgba.a];
	losp_slices._brush._color = rgbaColor;
}

function toggleClobberOption() {

	if (!volume) {
		return;
	}

	if ($('#clobberOption').prop('checked')) {
		losp_slices._brush._clobber = true;
	} else {
		losp_slices._brush._clobber = false;
	}

}

/*
 * Whenever 2d or 3d fill is on, clobber should
 * be enforced on
 */
function forceClobber(on) {
	
	if (on) {
		losp_slices._brush._clobberChecked = $('#clobberOption').prop('checked');
		$('#clobberOption').prop('checked', true);
		losp_slices._brush._clobber = true;
		document.getElementById('clobberOption').disabled = true;
	} else {
		$('#clobberOption').prop('checked', losp_slices._brush._clobberChecked);
		losp_slices._brush._clobber = losp_slices._brush._clobberChecked;
		document.getElementById('clobberOption').disabled = false;
	}
	
}

function toggleOption() {

	if (!volume) {
		return;
	}
	
	if ($('#brush-icon').hasClass('clicked-button')) {
		losp_slices._brush._mode = 1;
    	forceClobber(false);
	} else if ($('#bucket-icon').hasClass('clicked-button')) {
		losp_slices._brush._mode = 2;
		forceClobber(true);
	} else if ($('#magic2d-icon').hasClass('clicked-button')) {
		losp_slices._brush._mode = 3;
		forceClobber(true);
	} else if ($('#magic3d-icon').hasClass('clicked-button')) {
		losp_slices._brush._mode = 4;
		forceClobber(true);
	} 
	
	if ($('#eraser-icon').hasClass('clicked-button')) {
		losp_slices._brush._eraser = true;
		losp_slices._brush._mode = 1;
	} else {
		losp_slices._brush._eraser = false;
	}
	
	if($('#colorpicker-icon').hasClass('clicked-button')) {
		losp_slices._brush._mode = 5;
	}
	

}

function toggle3dBucketOption() {

	if (!volume) {
		return;
	}

	// TODO: Do nothing for now
	if ($('#3dBucketOption').prop('checked')) {
		//document.body.style.cursor = "url('../gfx/paint.png'), default";
		
		document.getElementById('2dBucketOption').disabled = true;
		forceClobber(true);
	} else {
		//document.body.style.cursor = 'default';
		
		document.getElementById('2dBucketOption').disabled = false;
		forceClobber(false);
	}

}

function copyOpenOption() {
	if (jQuery("#copy-dialog").is(":visible")) {
		return;
	}
	
	jQuery("#copy-dialog").dialog({
		modal: false
	});
	
}

var prev_view = "x";
function copyViewSelected() {
	var slicen = 0;
	if (jQuery("#copy-view-x").is(":checked")) {
		if (prev_view == "x") {
			return;
		}
		prev_view = "x";
		slicen = Math.floor(volume.indexX);
	} else if (jQuery("#copy-view-y").is(":checked")) {
		if (prev_view == "y") {
			return;
		}
		prev_view = "y";
		slicen = Math.floor(volume.indexY);
	} else if (jQuery("#copy-view-z").is(":checked")) {
		if (prev_view == "z") {
			return;
		}
		prev_view = "z";
		slicen = Math.floor(volume.indexZ);
	}
	jQuery("#copyFromNum").val(slicen);
	jQuery("#copyToNum").val(slicen+1);
}

function sliceCopyAction() {
	//zzztodo update views after copyx
	var copyFromNum = document.getElementById('copyFromNum').value;
	var copyToNum = document.getElementById('copyToNum').value;
	var dash = copyToNum.indexOf("-");
	if (dash > 0) {
		// range
		var dest1 = copyToNum.substring(0, dash);
		var dest2 = copyToNum.substring(dash+1, copyToNum.length);
		if (dest2>dest1) {
			for (var i = dest1; i <= dest2; i++) {
				if (!sliceCopySingle(copyFromNum, i)) {
					document.getElementById('functionMessage').innerHTML = 'Copy unsuccessful on slice ' + i;
					return;
				}
			}
			document.getElementById('functionMessage').innerHTML = 'Copy successful to range ' + copyToNum;
		} else {
			document.getElementById('functionMessage').innerHTML = 'Invalid range given';
		}
	} else {
		// single sclice
		if (sliceCopySingle(copyFromNum, copyToNum)) {
			document.getElementById('functionMessage').innerHTML = 'Copied to slice # ' + copyToNum;
		} else {
			document.getElementById('functionMessage').innerHTML = 'Copy unsuccessful';
		}
	}
}

function sliceCopySingle(from, to) {
	var retVal = losp_copy(false, prev_view, volume._labelmap, from, to);
	
	if (retVal != null) {
		return true;
	} else {
		return false;
	}
}

function switchButton(rend,container) {
	_old_2d_content = eval('_current_'+container+'_content');
    eval('var cont = '+rend+'.container');    
    showLarge(jQuery(cont), _old_2d_content);
}

function changeSliceOption(slice, prev) {
	
	var changeSlice = -1;
	
	switch(slice) {
		case 'X':
			changeSlice = prev ? volume.indexX - 1 : volume.indexX + 1;
			if (changeSlice < 0 || changeSlice > volume.dimensions[0] - 1) {
				return;
			}
			
			volume.indexX = Math.floor(changeSlice);
			jQuery("#yellow_slider").slider("option", "value", volume.indexX);
			// For showing current slide number
		 	document.getElementById('sliceXText').innerHTML = "Sagittal slice number: " 
		  		+ volume.indexX;
			break;
		case 'Y':
			changeSlice = prev ? volume.indexY - 1 : volume.indexY + 1;
			if (changeSlice < 0 || changeSlice > volume.dimensions[1] - 1) {
				return;
			}
			
			volume.indexY = Math.floor(changeSlice);
			jQuery("#red_slider").slider("option", "value", volume.indexY);
			// For showing current slide number
		 	document.getElementById('sliceYText').innerHTML = "Coronal slice number: " 
		  		+ volume.indexY;
			break;
		case 'Z':
			changeSlice = prev ? volume.indexZ - 1 : volume.indexZ + 1;
			if (changeSlice < 0 || changeSlice > volume.dimensions[2] - 1) {
				return;
			}
			
			volume.indexZ = Math.floor(changeSlice);
			jQuery("#green_slider").slider("option", "value", volume.indexZ);
			// For showing current slide number
		 	document.getElementById('sliceZText').innerHTML = "Axial slice number: " 
		  		+ volume.indexZ;
			break;
		default:
			window.console.log('Error: slice type incorrect');
			break;
	}
	
}

/////////////////////////////////////////////
// TODO: end of added functions
/////////////////////////////////////////////

//
// MESH
//
function toggleMeshVisibility() {

  if (!mesh) {
    return;
  }
  
  mesh.visible = !mesh.visible;
  

}

function meshColor(hex, rgb) {

  if (!mesh) {
    return;
  }
  
  mesh.color = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  

}

function opacityMesh(event, ui) {

  if (!mesh) {
    return;
  }
  
  mesh.opacity = ui.value / 100;
  

}

function thresholdScalars(event, ui) {

  if (!mesh) {
    return;
  }
  
  mesh.scalars.lowerThreshold = ui.values[0] / 100;
  mesh.scalars.upperThreshold = ui.values[1] / 100;
  

}

function scalarsMinColor(hex, rgb) {

  if (!mesh) {
    return;
  }
  
  mesh.scalars.minColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  

}

function scalarsMaxColor(hex, rgb) {

  if (!mesh) {
    return;
  }
  
  mesh.scalars.maxColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  

}

//
// Fibers
//
function toggleFibersVisibility() {

  if (!fibers) {
    return;
  }
  
  fibers.visible = !fibers.visible;
  

}

function thresholdFibers(event, ui) {

  if (!fibers) {
    return;
  }
  
  fibers.scalars.lowerThreshold = ui.values[0];
  fibers.scalars.upperThreshold = ui.values[1];
  

}
