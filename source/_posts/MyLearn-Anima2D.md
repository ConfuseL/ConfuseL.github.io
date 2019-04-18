---
title: <学习记录>Unity Anima2D编辑器的轻量骨骼动画和换装使用
date: 2019-2-26 20:47:51
tags: 问题以及解决方案
categories: Unity3D
copyright: true
keywords: [Unity3D,Anima2D,骨骼动画，换装]
description: 一个很简单的Anima2D骨骼动画和换装教程
---

[TOC]

### <学习记录>Unity Anima2D编辑器的轻量骨骼动画和换装使用

#### 前言

​	前不久觉得骨骼动画难弄而选择帧动画，现在发现，一个人制作帧动画的工作量真的大，特别是发现需要换肤功能的时候，目前没有找到可以让同一个帧动画替换特定像素达到换肤效果的简易方法（~~shader可以简单换色，但是如果要有特别的形状图案就很复杂了~~），于是乎找到了一些关于Unity5.x版本之后自带的anima2D骨骼动画系统的一些文档，决定弃用帧动画使用骨骼动画。

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-25/9150e4e5gy1fygz3nlw8bj20qo0qo3zr.jpg)

​	这篇来做一个简易演示。

#### 图片准备

​	将精灵图拖到Unity之后设置属性，因为画的时候是以1像素为单位，所以选择了FilterMode为Point。随后通过SpriteEditor将图片切割好，注意这里一定要**规定好切割区域的大小**，也就是规定如所有头部、身体精灵图的共同切割大小，以便骨骼的绑定不会产生换肤的图片偏移，对碰撞体有要求的同样可以设置得精细一点。

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E5%9B%BE%E7%89%87%E8%AE%BE%E7%BD%AE.png)

#### 精灵网格和骨骼设置

​	将必要的头、身体、腿的图片拖入视图后，摆好位置，创建父物体Player，对其一一设置精灵网格，右键2D Object->SpriteMesh

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E8%AE%BE%E7%BD%AE%E7%B2%BE%E7%81%B5%E5%9B%BE%E5%B1%82.png)

​	随后可以在父物体Player下创建骨骼，右键2D Object->Bone

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E8%AE%BE%E7%BD%AE%E9%AA%A8%E9%AA%BC.png)

​	将创建的骨骼与摆好的图片对齐，如果在骨骼下创建骨骼，会生成子骨骼，子骨骼会随着父骨骼移动。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E5%8F%B3%E6%89%8B%E9%AA%A8%E9%AA%BC.png)

​	

#### 骨骼绑定

​	设置好骨骼，图片也对应好之后，将网格与骨骼绑定，点击视图中的头，查看监视面板，创建了网格会绑定的两个组件分别是SpriteMeshInstance和SpriteMeshRenderer，本篇只讲解SpriteMeshInstance的用法，SpriteMesh是精灵网格，可以在面板上设置，也可以在代码上设置，这也是本篇换装的重要途径，随后是颜色、材质、层级、Set bones骨骼设置，我们将对应的骨骼拖入这里，**注意，拖入带有子骨骼的骨骼，会将子骨骼一起绑定，若子骨骼需要与其他图片绑定，请删除掉，以免冲突。**

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E7%BB%91%E5%AE%9A%E9%AA%A8%E9%AA%BC.png)

​	拖入以后并没有直接绑定成功，这时候我们需要通过Anima2D编辑器绑定骨骼，菜单栏Winodws->Anima2D->SpriteMesh Editor，点击Bind按钮将自动的计算骨骼的权重。点击Apply即可绑定，也可以通过Weight Editor设置影响程度，在此之前也可以在编辑器上通过鼠标来划分你的蒙皮需求。如果一张图片上有多个骨骼，那么你就要设置每个骨骼在某些三角形上的权重，让骨骼动作时图片动作的更逼真。而个人不需要过于精细，因此本篇没有特定设置蒙皮划分。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E5%BA%94%E7%94%A8%E9%AA%A8%E9%AA%BC.png)

​	绑定骨骼以后，可以在视图界面控制骨骼，查看是否绑定成功。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E9%AA%A8%E9%AA%BC%E7%A7%BB%E5%8A%A8%E9%A2%84%E8%A7%88.gif)

#### IK绑定

​	反向力学系统，一般我们是通过骨骼的动作去控制图片，设置IK并绑定骨骼的话，通过操作IK控件，骨骼也会随着移动。这样我们可以更方便的做一些动画了。（展示图没有绑定武器，所以效果并不明显，但是骨骼效果随着IK的移动而移动很直白）

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/IK%E7%A7%BB%E5%8A%A8%E9%A2%84%E8%A7%88.gif)

​	IK动画分两种:IK CCD、IK Limb。 
​	IK Limb适合肢体骨骼动画。IK CCD适合更长的骨骼。本篇使用Limb，在父物体Player下创建IK，右键2D Object->IK Limb ，在视图将IK部件移动到合适的位置之后，监视面板绑定骨骼，在这里，我们可以想像IK为关节，我们人体控制关节，骨骼也会随之移动，所以将IK绑定到对应的骨骼就好了。



![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E5%8F%B3%E6%89%8BIK.png)



![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/IK%E7%BB%91%E5%AE%9A%E9%AA%A8%E9%AA%BC.png)

#### 骨骼动画和换装

​	利用Animation编辑器，新建anim动画，对骨骼进行操作录制即可，然后播放的时候，通过改变对应SpriteMeshInstance的精灵网格即可。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/19-2-26/%E6%8D%A2%E8%82%A4%E9%A2%84%E8%A7%88.gif)

​	**注意，你要对所有提供换装的精灵网格对它对应骨骼进行单独的绑定！**

​	以下为本篇的换装样例代码

```C#
using Anima2D;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DebugBone : MonoBehaviour {

    private SpriteMeshInstance body;
    private Object[] clothesMesh;
    int key = 0;
    // Use this for initialization
    void Start () {
        body = GameObject.Find("身体").GetComponent<SpriteMeshInstance>();
        clothesMesh = Resources.LoadAll("SpriteMesh/clothes");
    }
	
	// Update is called once per frame
	void Update () {
        if (Input.GetKeyDown(KeyCode.A))
        {
            key++;
            key = key % 6;
            body.spriteMesh = (SpriteMesh)clothesMesh[key];
        }
	}
}

```

#### 参考文章和视频

​	视频： [【游戏美术难于上青天】 系列](https://www.bilibili.com/video/av20868780/?spm_id_from=333.788.videocard.0)

​	文章： [Anima2D官方中文使用手册（对应Anima2D1.1.4）](https://blog.csdn.net/hibernateplus/article/details/79060311)

