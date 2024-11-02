const testResult = document.querySelector("#testResult");
testResult.width = testResult.parentNode.clientWidth;
testResult.height = testResult.parentNode.clientHeight;

const canvasWidth = testResult.width;
const canvasHeight = testResult.height;
let myTool = testResult.getContext("2d");
const canvasPadding = {
	"left" : 150,
	"right" : 100,
	"bottom" : 200,
	"top" : 100
}

let canvasRealWidth = canvasWidth - canvasPadding.left - canvasPadding.right;
let canvasRealHeight = canvasHeight - canvasPadding.top - canvasPadding.bottom;

let YSlice = 20;
let YStep = canvasRealHeight / YSlice ;

let XGap = 1;
let YGap = 30;


let pointMin = 0;


let canvasDataArray = [];
let classPList = [];
let pointList = [];
let repliPointList = [];

let isClicked = false;
const inputPush = ()=>{
	document.querySelectorAll("#input_container li").forEach( (article,i, arraysI) =>{
		canvasDataArray[i] = [];
		
		article.querySelectorAll("input").forEach( (input,j,arraysJ) =>{
			canvasDataArray[i][j] = input.value;

			switch( j ){
				case 0 : 
					classPList.push( arraysJ[j].value );
					break;
				
				case 1 : 
					pointList.push( parseInt(arraysJ[j].value) );
					break;
			}
		})
	})
}

const styleInit = ()=>{
	myTool.fillStyle = "black";
	myTool.font = "16px Arial";
	myTool.textAlign = "center";
	myTool.textBaseline  = "center";
}

//pointList배열 복사
const copyPointList = () => {
	repliPointList = [];
	for(let i = 0; i < pointList.length; i++){
		repliPointList.push(pointList[i]);
	};
};

// x좌표 보정
const modifyPosX = ( xPos ) =>{
	return ( xPos + canvasPadding.left );
};

//좌표 보정 함수
const correctXY = ( xValue, yValue ) => {
	myTool.fillRect( xValue + canvasPadding.left , (yValue*-1) + canvasHeight - canvasPadding.bottom, 2, 2 );
}

//점 그리기 함수
const drawDot = ( xValue, yValue ) => {
	correctXY(xValue, yValue);
}

//서류 제목
const docTitle = ()=>{
	styleInit();
	myTool.fillStyle = "#ACE2E1";
	myTool.font = "50px Arial";
	myTool.fillText("HTML 시험 결과", canvasWidth/2 ,  canvasPadding.top);
}

//X축 그리기
const printAxisX = ()=>{
	styleInit();
	myTool.fillStyle = "#ACE2E1";
	for(let i = 1; i < canvasRealWidth ; i++){
		drawDot(i,0);
	};
}

//X축 구획 표시하기
const printStepX = ()=>{
	for(let i = 50; i < canvasRealWidth-200; i++){
		XGap = canvasRealWidth/canvasDataArray.length;

		if( i % XGap == 50 ){
			// x축 구획
			for(let j = -10; j < 10; j++){
				styleInit();
				myTool.fillStyle = "#41C9E2";
				drawDot(i,j);
			}
			// x축 점선
			for(let j=1; j < canvasHeight - canvasPadding.top - canvasPadding.bottom - 50; j+=1){
				styleInit();
				myTool.fillStyle = "#ededed";
				correctXY(i, j+20);
			};

			// if( i === XGap * XSlice ){break;}

			// x축 label 표시
			for(let j = 0; j < classPList.length; j++){
				styleInit();
				myTool.font = "14px Arial";
				myTool.textAlign = "center";
				myTool.fillText( classPList[j], canvasPadding.left + XGap*(j)+50, canvasRealHeight + canvasPadding.top + 40 );
			}
		}
	};
}

//Y축 그리기
const printAxisY = ()=>{
	for(let i=1; i < canvasHeight - canvasPadding.top - canvasPadding.bottom; i++){
		styleInit();
		myTool.fillStyle = "#41C9E2";
		drawDot(0, i);
	};
}

//Y축 구획 표시하기
const printStepY = ()=>{
	for(let i=1; i < canvasHeight - canvasPadding.top - canvasPadding.bottom ; i++){
		styleInit();
		myTool.font = "14px Arial";
		if( i % YGap == 0 ){
			
			// y축 구분바
			for(let j = -10; j < 10; j++){
				styleInit();
				myTool.fillStyle = "#41C9E2";
				drawDot(j,i);
			}

			// y축 점선 
			for(let j=1; j < canvasRealWidth; j+=10){
				myTool.fillStyle = "#ccc"
				correctXY(j+20, i);
			};

			if(i === YGap*20){break;}
				
			// y축 값표시 
			myTool.font = "20px Arial";
			for(let j = 1; j <= YSlice ; j++){
				myTool.textAlign = "right";
				styleInit();
				myTool.fillStyle = "#F7EEDD";
				myTool.fillText( 5*j , canvasPadding.left -30 , ( canvasRealHeight + canvasPadding.top ) - ( YGap * j ) + 6 ) ;
			}
		}
	}
}

// 그래프 하단에 적을 부가정보 출력
const printSubText = ()=>{
	const printSubContent = (content, XCoordinate, YCoordinate) => {
		styleInit();
		myTool.font = "30px Arial";
		myTool.fillStyle = "#F7EEDD";
		myTool.textBaseline  = "center";
		myTool.fillText(content, XCoordinate, YCoordinate); 
	};

	printSubContent("평균 : " + printPointAverage(), canvasWidth/2 - 300, canvasRealHeight + canvasPadding.top + 120);
	// printSubContent("(=========)", canvasWidth/2 - 300, canvasRealHeight + canvasPadding.top + 150 );
	
	printSubContent("중위값 : " + printPointMedian(), canvasWidth/2 - 100, canvasRealHeight + canvasPadding.top + 120);
	
	printSubContent("최대값 : " + printPointMax(), canvasWidth/2 + 100, canvasRealHeight + canvasPadding.top + 120);
	
	printSubContent("최소값 : " + printPointMin(),  canvasWidth/2 + 300, canvasRealHeight + canvasPadding.top + 120);
}

// 평균값 구하는 함수
const printPointAverage = () => {
	copyPointList();

	let pointAverage = 0;
	for(let i=0; i < repliPointList.length; i++){
		pointAverage += repliPointList[i];
	}
	pointAverage /= repliPointList.length;
	pointAverage = (Math.floor(pointAverage * 1000))/1000;
	if( isClicked ){
		myTool.fillStyle = "#ededed";
		for(let i = 1; i < canvasWidth - canvasPadding.left - canvasPadding.right ; i++){
			correctXY(i, ( YGap/5 ) * pointAverage);
		};
	}

	return pointAverage;
}

// pointList 배열 오름차순 정렬
const sortAscendingPoint = () => {
	copyPointList();
	for(let i = 0; i < repliPointList.length; i++){
		for(let j = 0; j < repliPointList.length; j++){
			let tempValue = 0;
			if( repliPointList[j] >= repliPointList[j+1] ){
				tempValue = repliPointList[j+1];
				repliPointList[j+1] = repliPointList[j];
				repliPointList[j] = tempValue;
			};
		}
	};
}

// 중위값 구하는 함수
const printPointMedian = () => {
	sortAscendingPoint();
	let median = 0;
	if(repliPointList.length % 2 !== 0){
		median = repliPointList[ Math.floor( repliPointList.length / 2 ) ]
	}else{
		median = ( repliPointList[ ( repliPointList.length / 2 ) -1 ] + repliPointList[ ( repliPointList.length / 2 ) ] ) / 2
	}

	return median;
}

// 최대값 구하는 함수
const printPointMax = () => {
	sortAscendingPoint();
	let pointMax = 0;
	pointMax = repliPointList[ repliPointList.length - 1 ];
	return pointMax;
}

// 최소값 구하는 함수
const printPointMin = () => {
	sortAscendingPoint();
	pointMin = repliPointList[ 0 ];
	return pointMin;
}

const inputHeaderButtonClicks = ()=>{
	document.querySelectorAll("#input_header_btn_container button").forEach( btns =>{
		btns.addEventListener("click", evt =>{
			

			// ** 차트 그리기
			const drawCanvawBtnFunc = ()=>{
				// 점 사이 잇기
				const modifyXY = () => {
					copyPointList();
					styleInit();
					for(let i=0; i < pointList.length-1; i++){
						let x1 = XGap * (i) + 50 ;
						let x2 = XGap * (i+1) + 50 ;
						let y1 = ( YGap * repliPointList[i] ) / 5;
						let y2 = ( YGap * repliPointList[i+1] ) / 5;
						let graphSlope = (y2 - y1) / (x2 - x1);
						
						for(j = x1; j < x2; j+=0.1){
							drawDot(j, (j - x1)*graphSlope + y1);
						}
					}
				}

				//점수들 각 위치에 출력하기
				const printPointLabeling = () => {
					copyPointList();
					// styleInit();
					myTool.font = "20px Arial";
					for(let i = 0; i < pointList.length; i++){
						const xPos = modifyPosX( 50 + XGap*i );
						const yPos = canvasPadding.top + canvasRealHeight - (YGap*repliPointList[i] / 5);
						const radius = 10;
						const startAngle = 0;
						const endAngle = 2 * Math.PI;
						styleInit();
						
						myTool.fillStyle = "white";
						myTool.fillText(repliPointList[i] , canvasPadding.left + XGap*i + 50 , canvasHeight - canvasPadding.bottom - (YGap*repliPointList[i] / 5) - 30);

						
						myTool.beginPath();
						myTool.fillStyle = "#7AC27A";
						myTool.arc( xPos - 1.5, yPos + 1.5, radius, startAngle, endAngle );
						myTool.stroke();
						myTool.closePath();
						myTool.fill();
					}
				}

				// ** 모든 조건을 만족했을 때 
				const allPassed = () =>{
					if( isPassed && isNameNotEmpty && isNotOver100 ){
						printAxisX();
						printStepX();
						printAxisY();
						printStepY();
						printSubText();
						
						//점수 좌표 선 그래프 출력하기
						modifyXY();
						
						//점수 위치별 출력
						printPointLabeling();
					}
				}
				let isNameNotEmpty = true;
				let isPassed = true;
				let isNotOver100 = true;

				pointList = [];
				classPList = [];
				myTool.clearRect(0,0,canvasWidth, canvasHeight);
				isClicked = true;
				
				canvasSetup();
				docTitle();
				inputPush();
				printAxisX();
				printAxisY();
				printStepY();
				printSubText();
				
				isPassed = ( pointList.some( point => point === 0 ) ) ? false : true;
				isNameNotEmpty = ( classPList.some( person => person === "" ) ) ? false : true;
				isNotOver100 = ( pointList.some( point => point > 100 ) ) ? false : true;
				
				if( !isPassed ){
					document.querySelector("#allZero").style.display = "flex";
					document.querySelectorAll("#allZero button").forEach( btns =>{
						btns.addEventListener("click",(evt)=>{
							switch( evt.currentTarget.id ){
								case "cancel_btn" : 
								case "close_btn" : 
									document.querySelector("#allZero").style.display = "none";
									break;
									
								case "OK_btn" : 
									isPassed = true;
									document.querySelector("#allZero").style.display = "none";

									allPassed();
									break;
							}
						});
					})
				}
				if( !isNotOver100 ){
					document.querySelector("#value_over_100").style.display = "flex";
					document.querySelectorAll("#value_over_100 button").forEach( btns =>{
						btns.addEventListener("click",()=>{
							document.querySelector("#value_over_100").style.display = "none";
						});
					});
				}

				if( !isNameNotEmpty ){
					document.querySelector("#not_input_name").style.display = "flex";
					document.querySelectorAll("#not_input_name button").forEach( btns =>{
						btns.addEventListener("click",()=>{
							document.querySelector("#not_input_name").style.display = "none";
						});
					});
				}

				allPassed();
			}

			//  ** 모든 input 리셋
			const resetBtnFunc = ()=>{
				document.querySelectorAll("#input_container li").forEach( article =>{
					article.querySelectorAll("input").forEach( input =>{
						switch( input.type ){
							case "number" : 
								input.value = 0;
								break;
		
							case "text" : 
								input.value = "";
								break;
						}
					})
				})
			}

			// ** 목록 추가
			const addListBtnFunc = ()=>{
				document.querySelector("#input_container").insertAdjacentHTML("beforeend",`<li class="input_list">
					<label><span>이름 :</span> <input type="text" placeholder="이름" /></label>
					<label><span>점수 :</span> <input type="number" placeholder="점수" value="0" /></label>
				</li>`)
			}


			switch( evt.currentTarget.id ){
				case "drawCanvaw_btn": drawCanvawBtnFunc();break;
				case "reset_btn": resetBtnFunc();break;
				case "addList_btn": addListBtnFunc();break;
			}
		})
	})
}

const canvasSetup = ()=>{
	myTool.fillStyle = "#008DDA";
	myTool.fillRect(0,0,testResult.width, canvasHeight);
}
(function main(){
	canvasSetup();
	
	
	inputHeaderButtonClicks();
	
	docTitle();
	inputPush();
	printAxisX();
	printAxisY();
	printStepY();
	printSubText();
})()
