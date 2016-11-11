(function(){
    function addWheel(ele,fn){
        function fnWheel(e){
            //fnWheel这个函数中，是用来检测鼠标滚轮的方向；--bOk;
            e=e||window.event;
            var bOk=false; //想让这个布尔值，true：down； false：up
            if(e.wheelDelta){//chrome/IE
                bOk= e.wheelDelta<0?true:false; //down:true; up:false;
            }else{//firefox
                bOk= e.detail>0?true:false; //down:true; up:false;
            }
            //判断bOk;
            fn&&fn.call(ele,bOk); //回调函数被调用，传参，改变this指向；
            //阻止默认事件
            e.preventDefault?e.preventDefault(): e.returnValue=false;
        }
        //当鼠标滚轮这个行为被触发的时候，要干fnWheel里面的事情；
        if(navigator.userAgent.toLowerCase().indexOf('firefox') !==-1){//Firefox
            ele.addEventListener('DOMMouseScroll',fnWheel,false);
        }else{
            ele.onmousewheel=fnWheel;
        }
    }
    window.wheel=addWheel;
})();