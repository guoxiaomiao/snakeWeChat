//手指按下时的坐标
let startX = 0;
let startY = 0;

//手指移动的坐标
var moveX = 0;
var moveY = 0;

//移动位置距开始位置的差值
var X = 0;
var Y = 0;

//蛇头坐标
var snakeHead={
  x:0,
  y:0,
  color:"#8e2323",
  width:20,
  heigh:20
}

//身体对象
var snakeBodys=[];
//食物对象
var foods=[];
//窗口宽高
var windowWidth=0;
var windowHeigh=0;
//用于确定是否删除
var collideBol=true;
//手指的方向
var direcation=null;
//蛇移动的方向
var snakeDirecation="right";

Page({

  canvasStart: function (e) {
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },

    canvasMove : function (e) {
      moveX = e.touches[0].x;
      moveY = e.touches[0].y;

      X = moveX - startX;
      Y = moveY - startY;

      if (Math.abs(X) > Math.abs(Y) && X > 0) {
        direcation="right"
      } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
        direcation="left"
      } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
        direcation="buttom"
      } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
        direcation="top"
      }
    },
    canvasEnd:function(){
      snakeDirecation=direcation;
    },

   
    onReady:function(){
     
      //获取画布上下文
      var context=wx.createContext();
      //帧数
      var frameNum=0;

      function draw(obj){
        //设置蛇头填充颜色
        context.setFillStyle(obj.color);
        //开始绘制
        context.beginPath();
        //绘制路径
        context.rect(obj.x, obj.y, obj.width, obj.heigh);
        //关闭路径
        context.closePath();
        //填充
        context.fill();
      }
      //碰撞函数
      function collide(obj1,obj2){
        var l1=obj1.x;
        var r1=l1+obj1.width;
        var t1=obj1.y;
        var b1=t1+obj1.heigh;

        var l2= obj2.x;
        var r2 = l2 + obj2.width;
        var t2 = obj2.y;
        var b2 = t2 + obj2.heigh;
        if(r1>l2 && l1<r2 && b1>t2 &&t1<b2 ){
          return true;
        }else{
          return false;
        }

      }
     
      function animate(){
        frameNum++;
        if(frameNum%20==0){
          //向蛇身体数组添加一个最新的位置（身体对象）
          snakeBodys.push({
            x: snakeHead.x,
            y: snakeHead.y,
            width: 20,
            heigh: 20,
            color: "#bc1717"
          });
          if (snakeBodys.length > 4) {
            //移除不用的身体位置
            if(collideBol){
              snakeBodys.shift();
            }else{
              collideBol=true;
            }
            
          }
          switch (snakeDirecation) {
            case "right":
              snakeHead.x += snakeHead.width
              break;
            case "left":
              snakeHead.x -= snakeHead.width
              break;
            case "buttom":
              snakeHead.y += snakeHead.heigh
              break;
            case "top":
              snakeHead.y -= snakeHead.heigh
              break;
          }
         
        }

        //绘制蛇头
        draw(snakeHead);
      
        //绘制蛇身
        for(var i=0;i<snakeBodys.length;i++){
          var snakeBody=snakeBodys[i];
          draw(snakeBody)

        }
        //绘制食物
        for(var i=0;i<foods.length;i++){
          var foodObj=foods[i];
          draw(foodObj);
          if(collide(snakeHead,foodObj)){
            console.log("撞上了");
            collideBol=false;
            foodObj.reset();
          }
        }
        wx.drawCanvas({
          canvasId:"snakeCanvas",
          actions:context.getActions()
        });
          requestAnimationFrame(animate);
      }
      //随机函数
      function rand(max,min){
        return parseInt(Math.random()*(max-min))+min;
      }
      //构造食物函数
      function food() {
        this.x = rand(0,windowWidth-20);
        this.y=rand(0,windowHeigh-20);
        var w = rand(10, 20);
        this.width=w;
        this.heigh=w;
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) +")"
        this.reset=function(){
          this.x = rand(0, windowWidth - 20);
          this.y = rand(0, windowHeigh - 20);
          this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")"
        }
      }
      wx.getSystemInfo({
        success: function (res) {
         windowWidth=res.windowWidth;
         windowHeigh=res.windowHeight;
         for(var i=0;i<20;i++){
           var foodObj=new food();
           foods.push(foodObj);

         }
         animate();
        }
      })

     



     
   
      
    }
    
    

})

