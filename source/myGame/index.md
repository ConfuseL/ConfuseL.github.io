---
title: 独立游戏开发记录
date: 2019-04-04 19:17:38
---

# 我的游戏开发记录

> 游戏的开发过程都在此记录。

- [生存类手游：瑞特秘岛](#生存类手游：瑞特秘岛)
  - [2019-3月](#2019-3月)
  - [2018-12月](#2018-12月)
  - [2018-11月](#2018-11月)
- [跑酷类手游：海底世界](#跑酷类手游：海底世界)

## 生存类手游：瑞特秘岛

### 2019-3月

#### 本月主要开发内容

放弃了帧动画，使用Anima2D制作的骨骼动画，花了不少时间写了自己的第一个[开源背包框架](https://github.com/ConfuseL/RookiesGoods)，同时用于重构游戏里的背包系统。

#### 成果图片以及描述

Anima2D骨骼动画的简单使用可以参考我的另一篇文章[Unity Anima2D编辑器的轻量骨骼动画和换装使用](http://confusel.tech/2019/MyLearn-Anima2D/)​			

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/3%E6%9C%88/%E9%AA%A8%E9%AA%BC%E5%8A%A8%E7%94%BB%2B%E6%8D%A2%E8%A3%85%2B%E8%9E%8D%E5%90%88.gif)

###### *1.手持武器的更换效果*

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/3%E6%9C%88/%E8%93%84%E5%8A%9B%E6%94%BB%E5%87%BB%E5%88%B6%E4%BD%9C.gif)

###### *2.棍类武器的蓄力攻击动画*



![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/3%E6%9C%88/%E7%9F%9B%E7%B1%BB%E8%93%84%E5%8A%9B%E6%94%BB%E5%87%BB%E6%BC%94%E7%A4%BA.gif)

###### *3.长矛类武器的蓄力攻击动画*



![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/3%E6%9C%88/%E5%88%80%E7%B1%BB%E8%93%84%E5%8A%9B%E6%94%BB%E5%87%BB%E6%BC%94%E7%A4%BA.gif)

###### *4.刀类武器的蓄力攻击动画*

### 2018-12月

#### 本月主要开发内容

绘制大部分UI界面所用的素材、绘制主角样板和一些动画，然后对原来的UI布局根据像素风进行了一些修改。

#### 成果图片以及描述

板子用的是ctl672，绘制软件有PS和piskel，没有什么美术功底强上，在piskel上不支持压感，所以画主角样板的时候都是现在PS上画 再转到piskel做帧动画的。

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/69300899.jpg)
*总览*
<!--more-->

##### **1.人物属性表**

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/55821958.jpg)
*每个两张，一张填满一张空，用填充分那个是控制数值*

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/62814793.jpg)
*空san*

------

##### **2.电子表预览**

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/28929937.jpg)
*打算6/12min现实时间为游戏的一天，用uv动画去控制时间流动*

------

##### **3.人物待机图**

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/5299326.jpg)
*在piskel上绘制帧动画，导出x*y行列的图集，然后在Unity上自己分割，拖动就可以形成动画*
![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/27537244.jpg)
*人物待机图*

### 2018-11月

#### 本月主要开发内容

UI框架、UI布局、美术制作、游戏物品数据json化、主角存档格式等

#### 成果图片以及描述

对于一个没有美术资源的游戏开发前期，打算先从UI入手
由于截图软件问题，上面有大概0.5cm的高度矩形被截出了 但不影响观看

##### **1.操作方式预览**

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/82185343.jpg)

*左手移动 范围为2/5的左边屏幕
右手攻击 范围固定*

------

##### **2.背包预览**

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/48181651.jpg)
*还没在主角数据里添加，所以暂时为空*

------

##### **3.合成系统预览**

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/7190698.jpg)
*主要用到Toggle来选择合成表
点击目标物品，右侧会出现详情和合成所需的物品预览以及对应的消耗个数和已有个数*

------

##### **4.数据持久化**

JSON我也只是刚接触不久，用的litjson，因为我把所有物品都一股脑写入一个json里（手写。。。），解析不能用泛型，只好手动针对性解析(可能是我没学会其他更方便的方法)
顺便加了AES加密
主角的存档数据我也写了初版，并且加了脚本测试
测试为：向主角数据添加物品持有、然后在背包中查阅

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-11-30/35071897.jpg)
*(在电脑上编辑器中的测试，在电脑录制的gif 比手机的更清晰顺滑一些)*



## 跑酷类手游：海底世界