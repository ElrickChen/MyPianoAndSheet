
var last1;
var last2;
var clickedColor="black";
var onClickColor="#666666";
var controlColor="gold"
var wWidth=90;
var bWidth=46;
var borderWidth=1;
var nowLeft;
var record=[];
var recordI=0;
var row1Key=[];
var row2Key=[];
var row1KeyPressed=[];
var row2KeyPressed=[];
var controlRow=1;
//a=65 -71


var shot=false;

var canvas, canvasSlider, noteName, noteAccidental, noteOctave, noteDuration;
var context, stave;
var numBeats = 4, beatValue = 4, noteOffsetLeft;
var formatter, tickIndex = 0, cursorHeight = 150;
var noteIndex = 0, voice;
// notes array in score in vexflow format
var notes = new Array();
var isDown = false;

function startShot()
{
	shot=true;
}
function stopShot()
{
	shot=false;
}
function dealActive(keyName,row)
{
	
	 if (shot) 
	 {
        
        var no = keyName.substr(0, 1);
        var nn = keyName.substr(1, 1).toLowerCase();
        var na = keyName.substr(2, 1);
        var noteAcc = (na == "s") ? "#" : "";
        var noteAcci = (na == "s") ? "#" : "none"
        var noteObject = { keys: [nn + noteAcc + "/" + no], duration: "q", accidental: noteAcci };
        addNote(noteObject);
    }
	//document.getElementById("record").innerHTML=keyName;
	//console.log("sound"+keyName);
	var A=document.getElementById("sound"+keyName);
	console.log(A);
	if(A.ended==false)
		A.load();
	A.play();
	

}
function dealKeyUp(keyName,row)
{
	
	var A=document.getElementById("sound"+keyName);
	//console.log(A.currentTime);
	if(A.currentTime>1.5)
		A.load();
	else
	{
		var leaveTime=A.currentTime;
		setTimeout(function(){checkAplay(A);},(1.5-leaveTime)*1000);
	}
		
	
}
function checkAplay(A)
{
	//console.log("end"+A.currentTime);
	if(A.currentTime>1.3)
		A.load();
}
function setKey(row ,Id ,ClassName)
{
	var Key = document.createElement("div");
	Key.className = ClassName ;
	Key.id = Id;
	
	if(ClassName=="wKey")
	{
		Key.onmousedown=function()
		{dealActive(Key.id.substring(0, 2),Key.id.charAt(2));};
		Key.onmouseup=function()
		{dealKeyUp(Key.id.substring(0, 2),Key.id.charAt(2));};
	}
	else
	{	Key.onmousedown=function()
		{dealActive(Key.id.substring(0, 3),Key.id.charAt(3));};
		Key.onmouseup=function()
		{dealKeyUp(Key.id.substring(0, 3),Key.id.charAt(3));};
	}
	row.appendChild(Key);
	return Key;
}
function clearChild(field)
{
	
	while(field.firstChild)
		field.removeChild(field.firstChild);
}
function generatePiano(row ,firstKey ,last )
{
	
	//清空row
	if(last1 ==firstKey||last2 ==firstKey)
		return;
	clearChild(row);
	//清空audio
	//clearChild(document.getElementById("sound"));
	//清除舊選擇區域顏色
	if(last!=undefined)
		last.style.backgroundColor=clickedColor;
	document.getElementById(firstKey).style.backgroundColor=onClickColor;
	
	//setAudio(firstKey);
	//紀錄選擇區域//清除舊鍵盤指令//設置鍵盤區域
	
	if(firstKey.charAt(8)==1)
	{	
		last1 = firstKey;
		row1Key.length = 0;
		var key=row1Key;
		var keyPressed=row1KeyPressed;
		var wBoard=["q","w","e","r","t","y","u","i","o","p"];
		var bBoard=["2","3","4","5","6","7","8","9","0"];
	}
	else
	{
		last2 = firstKey;
		row2Key.length = 0;
		var key=row2Key;
		var keyPressed=row2KeyPressed;
		var wBoard=["z","x","c","v","b","n","m",",",".","/"];
		var bBoard=["s","d","f","g","h","j","k","l",";"];
	}
	var wI=0;
	var bI=0;
	
	
	
	//about id
	var scale = firstKey.charAt(0);
	var Solmization = firstKey.charCodeAt(1);
	//Black Key left
	
	nowLeft=wWidth-(bWidth/2)+borderWidth;
	
	for(var i = 0 ; i<10 ; i++)
	{	//產生白鍵
		
		var wKey = setKey(row ,scale+String.fromCharCode(Solmization)+row.id.charAt(3) ,"wKey");
		//setAudio(wKey.id.substring(0, 2));
		key[wI+bI]=wBoard[wI];
		keyPressed[wI+bI]=0;
		wI++;
		if(wKey.id.charAt(1)!="E"&&wKey.id.charAt(1)!="B"&&i!=9)
		{	//產生黑鍵
			var bKey = setKey(row ,scale+String.fromCharCode(Solmization)+"s"+row.id.charAt(3) ,"bKey");
			bKey.style.left=nowLeft;
			//setAudio(bKey.id.substring(0, 3));
			key[wI+bI]=bBoard[wI-1];
			keyPressed[wI+bI]=0;
			bI++;
		}
		
		nowLeft+=wWidth+(borderWidth*2);
		//決定id
		Solmization++;
		switch(Solmization)
		{
		//C
		case 67:
		{
			/*if(scale=="L")scale="0";
			else*/ scale = parseInt(scale)+1;
			
			break;
		}
		//H
		case 72:
		{
			Solmization = 65 ;
			break;
		}
		}
		
	}
	//console.log(key);
	//console.log(row);
	$("#"+"row"+row.id.charAt(3)+" > "+".bKey").fadeIn(500);
	$("#"+"row"+row.id.charAt(3)+" > "+".wKey").fadeIn(1500);
	
	
	
	


}

function generateSelect(selectField)
{
	
	for(var j = 0 ; j<2; j++)
	{
		
		var Select = document.createElement("div");
		Select.className = "select";
		var s ="1"+String.fromCharCode("A".charCodeAt(0) + j);
		Select.id=s+selectField.id;
		Select.innerHTML = s;
		if(selectField.id.charAt(6)=="1")
			Select.onclick = function() 
		{
			generatePiano(document.getElementById("row"+selectField.id.charAt(6)),event.target.id ,document.getElementById(last1));
			changeControl(-1);
		};
		else
			Select.onclick = function() 
		{
			generatePiano(document.getElementById("row"+selectField.id.charAt(6)),event.target.id ,document.getElementById(last2) );
			changeControl(1);
		};
		
		
		selectField.appendChild(Select);

	}
	
	for(var i = 2 ; i < 7 ; i++)
	{
		for(var j = 0 ; j < 7 ; j++)
		{
			
			var Select = document.createElement("div");
			Select.className = "select";
			if(j<5)
			{
				
				var s =i+String.fromCharCode("C".charCodeAt(0) + j);
				Select.innerHTML = s;
				Select.id=s+selectField.id;
			}
				
			else
			{
				var s =i+String.fromCharCode("A".charCodeAt(0) + j-5);
				Select.innerHTML = s;
				Select.id=s+selectField.id;
			}
			if(selectField.id.charAt(6)=="1")
			Select.onclick = function() 
		{
			generatePiano(document.getElementById("row"+selectField.id.charAt(6)),event.target.id ,document.getElementById(last1) );
			changeControl(-1);
		};
		else
			Select.onclick = function() 
		{
			generatePiano(document.getElementById("row"+selectField.id.charAt(6)),event.target.id ,document.getElementById(last2) );
			changeControl(1);
		};
			
		
			selectField.appendChild(Select);
	
		}
	}
	for(var j = 0 ; j < 6 ; j++)
		{
			
			var Select = document.createElement("div");
			Select.className = "select";
			if(j<5)
			{
				
				var s =i+String.fromCharCode("C".charCodeAt(0) + j);
				Select.innerHTML = s;
				Select.id=s+selectField.id;
			}
				
			else
			{
				var s =i+String.fromCharCode("A".charCodeAt(0) + j-5);
				Select.innerHTML = s;
				Select.id=s+selectField.id;
			}
			if(selectField.id.charAt(6)=="1")
			Select.onclick = function() 
		{
			generatePiano(document.getElementById("row"+selectField.id.charAt(6)),event.target.id ,document.getElementById(last1) );
			changeControl(-1);
		};
		else
			Select.onclick = function() 
		{
			generatePiano(document.getElementById("row"+selectField.id.charAt(6)),event.target.id ,document.getElementById(last2) );
			changeControl(1);
		};
			
			
			selectField.appendChild(Select);
	
		}
	

	

}
function changeControl(direct)
{
	controlRow+=direct;
	if(controlRow==0)
		controlRow=1;
	if(controlRow==3)
		controlRow=2;
	if(controlRow==1)
	{
		
		$("#select1 > div:eq(0)").css("border-left-color", controlColor);
		$("#select2 > div:eq(0)").css("border-left-color", onClickColor);
		
	}
	else
	{
		
		$("#select2 > div:eq(0)").css("border-left-color", controlColor);
		$("#select1 > div:eq(0)").css("border-left-color", onClickColor);
		
	}
}
function jumpSelect(direct)
{
	if(controlRow==1)
		last=last1;
	else
		last=last2;
	var NextScale ;
	var NextSolmization;
	if(last.charAt(0)=="6"&&direct==1)
	{
		NextScale="6";
		NextSolmization="A";
	}
	else if(last.substring(0,2)=="1C"&&direct==-1)
	{
		NextScale="0";
		NextSolmization="A";
	}
	else if(last.charAt(0)=="0")
		if(direct==1)
		{
			NextScale="1";
			NextSolmization="C";
		}
		else 
		{
			NextScale="0";
			NextSolmization="A";
		}
	else
		if(direct==1)
		{
			console.log(parseInt(last.charAt(0)));
			console.log(NextScale);
			NextScale=parseInt(last.charAt(0))+1;
			NextSolmization="C";
		}
		else
		{
			NextSolmization="C";
			if(last.charAt(1)=="C")
				NextScale=parseInt(last.charAt(0))-1;
			else
				NextScale=last.charAt(0);
		}

	generatePiano(document.getElementById("row"+controlRow),NextScale+NextSolmization+"select"+controlRow ,document.getElementById(last) );
	
}
function shiftSelect(direct)
{
	if(controlRow==1)
		last=last1;
	else
		last=last2;
	var NextSolmization=last.charCodeAt(1);
	var NextScale=last.charAt(0);
	NextSolmization+=direct;
	if(direct==1)
	{
		if(last.substring(0,2)=="6A")
			return;
		switch(NextSolmization)
		{
		//C
		case 67:
		{
			 NextScale = parseInt(NextScale)+1;
			
			break;
		}
		//H
		case 72:
		{
			NextSolmization = 65 ;
			break;
		}
		}
		}
	
	else
	{
		if(last.substring(0,2)=="0A")
			return;
		switch(NextSolmization)
		{
		//B
		case 66:
		{
			
			NextScale = parseInt(NextScale)-1;
			
			break;
		}
		//<A
		case 64:
		{
			NextSolmization = 71 ;
			break;
		}
		}
	}
	NextSolmization=String.fromCharCode(NextSolmization);
	console.log(NextScale+NextSolmization+"select"+controlRow);
	generatePiano(document.getElementById("row"+controlRow),NextScale+NextSolmization+"select"+controlRow ,document.getElementById(last) );	
	
}
function matchKey(row,d)
{
	if(event.ctrlKey)
	{
		switch(event.key)
		{
		case "ArrowUp":
		{	
			changeControl(-1);
			return;
		}
		case "ArrowDown":
		{
			changeControl(1);
			return;
		}
		
		}
	}
	if(event.shiftKey)
	{		
		switch(event.key)
		{
		case "ArrowUp":
		{	
			jumpSelect(-1);
			return;
		}
		case "ArrowDown":
		{
			jumpSelect(1);
			return;
		}
		case "ArrowRight":
		{
			shiftSelect(1);
			return;
		}
		case "ArrowLeft":
		{
			shiftSelect(-1);
			return;
		}
		}
	}
	
	
	if(row==1)
	{
		var row="row1";
		var key=row1Key;
		var keyPressed=row1KeyPressed;
	}
	
	else
	{
		var row="row2";
		var key=row2Key;
		var keyPressed=row2KeyPressed;
	}
	
	for(var i in key)
		{
			
			if(event.key.toLowerCase()==key[i].toLowerCase())
			{
				if(d==0)
				{	console.log("find");
					if(keyPressed[i]==1)
						return 1;
					keyPressed[i]=1;
					$("#"+row+" div:eq("+i+")").addClass("mousedown");
					$("#"+row+" div:eq("+i+")").trigger("onmousedown");
					return 1;
				}
				else
				{
					keyPressed[i]=0;
					$("#"+row+" div:eq("+i+")").removeClass("mousedown");
					$("#"+row+" div:eq("+i+")").trigger("onmouseup");
					return 1;
				}
			}
			i++;
		}
	return 0 ;
}


function start()
{	
	
	generateSelect(document.getElementById("select1"));
	generateSelect(document.getElementById("select2"));
	$(".select").slideDown(1000);
	generatePiano(document.getElementById("row1"),"3Cselect1");
	generatePiano(document.getElementById("row2"),"3Cselect2");
	console.log(document.getElementById("select1"));
	$("#select1 > div:eq(0)").css("border-left-color", controlColor);
	document.onkeypress=function()
	{
		
		
		var find=matchKey(1,0);
		if(find==0)
			matchKey(2,0);
		
		
		
		
	}
	
	document.onkeyup=function()
	{
		var find=matchKey(1,1);
		if(find==0)
			matchKey(2,1);
	}
	 canvas = document.getElementById("score");
    canvasSlider = document.getElementById("canvasSlider");
    noteName = document.getElementById("noteName");
    noteAccidental = document.getElementById("accidental");
    noteOctave = document.getElementById("octave");
    noteDuration = document.getElementById("duration");

    var render = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    context = render.getContext();

    prepareStave();
    highlightNote();
    drawStave();

    canvas.addEventListener("click", scoreOnClick, false);

    canvasSlider.addEventListener("mousedown", function () { isDown = true; }, false);
    canvasSlider.addEventListener("mousemove", sliderReDraw, false);
    canvasSlider.addEventListener("mouseup", function () { isDown = false; }, false);

    document.getElementById("add").addEventListener("click", function () {
        var vexNote = parseNote();
        addNote(vexNote);
    }, false);

    document.getElementById("del").addEventListener("click", deleteNote, false);
	
}
function prepareStave() {
    var size;
    if (notes.length < 6)
        size = 550;
    else
        size = (notes.length + 1) * 85;

    stave = new Vex.Flow.Stave(10, 20, size);
    stave.addClef("treble");
    // 44拍
    stave.addTimeSignature(numBeats + "/" + beatValue);
    // C大調
    stave.addKeySignature("C");
    // calc offset for first note - accounts for pixels used by treble clef & time signature & key signature
    noteOffsetLeft = stave.start_x + stave.glyph_start_x;
}

function highlightNote() {
    context.fillStyle = "rgba(0, 100, 250, 0.4)";
    // 如果存在
    if (notes.length > 0) {
        // 當加入新 note 或編輯已有的 note 畫游標給下一個新的note(the tickIndex will be undefined in map object for a new note)
        if (formatter.tContexts.map[tickIndex] == undefined) {
            var tempIndex = tickIndex - notes[notes.length - 1].ticks;
            context.fillRect(noteOffsetLeft + formatter.tContexts.map[tempIndex].x + 60, 10, 16.5, cursorHeight);
        }
        else {
            context.fillRect(noteOffsetLeft + formatter.tContexts.map[tickIndex].x, 10,
                formatter.tContexts.map[tickIndex].width + formatter.tContexts.map[tickIndex].padding * 2, cursorHeight);
        }
    }
    else {
        context.fillRect(noteOffsetLeft, 10, 16, cursorHeight);
    }
    context.fillStyle = "#000";
}


function drawStave() {
    stave.setContext(context).draw();
}

function scoreOnClick(event) {
    // 如果 note 存在
    if (notes.length > 0) {
        var x, y;
        if (event.pageX != undefined && event.pageY != undefined) {
            x = event.pageX;
            y = event.pageY;
        }
        else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        findNote(x);
        context.clear();
        prepareStave();
        prepareNotes();
        highlightNote();
        drawStave();
        drawNotes();
    }
}

// 找出在此x位置的note
function findNote(xCord) {
    if (formatter.tContexts.map[tickIndex] == undefined)
        tickIndex -= notes[notes.length - 1].ticks;
    var dif = canvas.width;
    //給 note 設 tickIndex
    for (var note in formatter.tContexts.map) {
        // skip var notes in note array
        if (formatter.tContexts.map[note].maxTicks == 0)
            continue;

        var temp = Math.abs(noteOffsetLeft + formatter.tContexts.map[note].x + formatter.tContexts.map[tickIndex].width - canvasSlider.value - xCord);
        if (temp < dif) {
            dif = temp;
            tickIndex = note;
        }
    }
    // 如果 user 點新的 note (anything to the right of the last existing note)
    if ((noteOffsetLeft + formatter.tContexts.map[tickIndex].x + formatter.tContexts.map[tickIndex].width + 30 - canvasSlider.value - xCord) < 0) {
        tickIndex = 0;
        for (var i = 0; i < notes.length; i++) {
            tickIndex += notes[i].ticks;
        }
        noteIndex = notes.length;
    }
    // 設 noteIndex 給 'notes' array based on tickIndex 'map' object
    var i = 0;
    for (var note in formatter.tContexts.map) {
        if (tickIndex == note) {
            noteIndex = i;
            break;
        }
        i++;
    }
}

function prepareNotes() {
    // add new measure if necessary
    prepareMeasures();
    // 創建 voice in 4/4
    voice = new Vex.Flow.Voice({
        num_beats: numBeats,
        beat_value: beatValue,
        resolution: Vex.Flow.RESOLUTION
    });
    // 關掉 tick counter
    voice.setStrict(false);
    // 加 notes 給 voice
    voice.addTickables(notes);
    // Fornat and justify the notes
    var voiceSize = notes.length * 85 - 50;
    formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], voiceSize);
}
function prepareMeasures() {
    // sum ticks and add new measures when neccessary
    var sumTicks = 0;
    var totalTicksPerMeasure = 1024 * numBeats * beatValue;
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].duration == "b") {
            sumTicks = 0;
            continue;
        }
        if (sumTicks == totalTicksPerMeasure) {
            notes.splice(i, 0, new Vex.Flow.BarNote());
            noteIndex++;
            sumTicks = 0;
        }
        sumTicks += notes[i].ticks;
    }
}

function drawNotes() {
    voice.draw(context, stave);
}

function parseNote() {
    var noteAcc = (noteAccidental.value == "none") ? "" : noteAccidental.value;
    var noteObject = { keys: [noteName.value + noteAcc + "/" + noteOctave.value], duration: noteDuration.value, accidental: noteAccidental.value };
    return noteObject;
}

function addNote(noteObj) {
    // 編輯已有的 note
    if (noteIndex < notes.length) {
        if (noteObj.accidental == "none")
            notes.splice(noteIndex, 1, new Vex.Flow.StaveNote(noteObj));
        else
            notes.splice(noteAccidental, 1, new Vex.Flow.StaveNote(noteObj).addAccidental(0, new Vex.Flow.Accidental(noteAccidental.value)));
    }
        // 加入新 note
    else {
        if (stave.width < 2000) {
            // 加新的 note 到 notes 陣列的尾端
            if (noteObj.accidental == "none")
                notes.push(new Vex.Flow.StaveNote(noteObj));
            else
                notes.push(new Vex.Flow.StaveNote(noteObj).addAccidental(0, new Vex.Flow.Accidental(noteAccidental.value)));
            noteIndex = notes.length;
        }
        else {
            alert("不能更多了QAQ");
        }
    }

    context.clear();
    prepareStave();
    prepareNotes();
    drawStave();
    drawNotes();

    if (noteIndex > notes.length - 1) {
        // calculate note index for map array
        tickIndex = 0;
        for (var i = 0; i < notes.length; i++)
            tickIndex += notes[i].ticks;
    }
    highlightNote();

    // 更新 slider 最大值
    if (stave.width > 550) {
        canvasSlider.setAttribute("max", stave.width);
        //    canvasSlider.slider('refresh');
    }
}

function deleteNote() {
    notes.splice(noteIndex, 1);
    context.clear();
    prepareStave();
    drawStave();
    if (notes.length > 0) {
        prepareNotes();
        drawNotes();
    }
    highlightNote();
    // 更新 slider 最大值
    if (stave.width > 550) {
        canvasSlider.setAttribute("max", stave.width);
        //    canvasSlider.slider('refresh');
    }
}

function sliderReDraw() {
    if (isDown) {
        context.clear();
        // reset transformation
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(-1 * canvasSlider.value, 0);

        highlightNote();
        drawStave();

        if (notes.length > 0)
            drawNotes();
    }
}

$(document).ready(start);