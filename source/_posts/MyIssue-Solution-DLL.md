---
title: 关于Unity3D引用某些DLL发布之后可能出现的错误
date: 2018-12-31 19:26:51
tags: 问题以及解决方案
categories: Unity3D
copyright: true
keywords: [Unity3D,引用类库,问题解决]
description: Unity3D需要用的EPPLSUE.DLL写表格文件时，以及想用IRONPYTHON调用Pyhton脚本时遇到了这些问题，在这里总结一下。
---

[TOC]

##### 目的：

在肝专业课设的时候，需要用的EPPLSUE.DLL写表格文件时，以及想用IRONPYTHON调用pyhton脚本时遇到了这些问题，在这里总结一下

#### 主要问题：

1.引用第三方类库之后，无法发布。提示引用的类库不支持。

2.发布之后，使用到对应第三方类库内容时，发生错误，但是在编辑器里却没错误。

#### 问题可能原因和解决方法：

##### 问题1：

###### 可能原因：

目前遇到的大部分是都是因为Unity的NET版本和要使用的类库不一致导致的，虽然目前Unity的设置中支持3.5和4.X，但实际上使用那些4.0以上NET支持的类库，大部分就会出现VS编译器里无报错，但Unity编辑器里报错的问题，或者如问题1那样，无法发布。

###### 解决方法：

1.尽量使用非4.XNET支持的第三方类库，总能找到课替代的或者低版本(最后我还是没用上iron Python ,选择把python写成web后端了= =)。

2.在发布页面的Player Setting中设置使用的NET版本，更改Unity为.NET 4.X ，但大部分第三方库依然不支持

3.老老实实使用.NET3.5，并选择API为.NET2.0而不是它的子集2.0 Subset



![1546254086424](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-12-31/57526107.jpg)

*据说后面4.X会支持的更好，3.5也会被移除，希望能完全支持这些类库吧。*



##### 问题2：

###### 可能原因：

我遇到的是在Unity编辑器里生成表格是可以的,但是发布之后，却失败了，通过异常捕获发现出现不支持IBM347编码，其实是缺少Unity编辑器里自带的一些文件。

![1546253003361](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-12-31/93937234.jpg)

###### 解决方法：

把Unity\Editor\Data\Mono\lib\mono\unity下的L18N相关的所有.dll赋值到当前项目的Assets文件夹下，保存再发布就可以解决了。



![1546254852807](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-12-31/26360741.jpg)



![1546253429555](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/18-12-31/87144357.jpg)

以上大部分分析来源于自己，因此可能不是百分百正确，勿在意。