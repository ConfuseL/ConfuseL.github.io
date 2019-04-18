---
title: <学习记录>C++的虚函数表知识总结
date: 2019-4-5 23:32:43
tags: 知识总结
categories: C++
copyright: true
keywords: [虚函数,虚基表,虚函数表]
description: 虚函数是C++的特性之一，它为C++带来了多态和接口的作用，但是在内存中，这些到底是怎么分配的呢。
---
## 为VS中的CPP属性添加一行代码

> 我们在VS2017中新建一个CPP工程，并新建一个源文件。
>
> 在这个工程中，我们右键属性，在C++那一项的命令行子项中添加以下代码。

```
/d1 reportAllClassLayout
```

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E8%AE%BE%E7%BD%AE.png)

> 加上这行代码，可以在编译时，在**输出**窗口输出内存分布的信息。

## 有虚函数的类与无虚函数的类对比

> 我们新建两个类，分别为A和B，他们其中一个类拥有虚函数。
>
> 每一个类中有两个整形成员。

### 代码

```C++
class A
{
private:
	int a;
	int b;
public:
	A();
	~A();

private:

};

class B
{
private:
	int a;
	int b;
public:
	B();
	virtual ~B();
	virtual void fun();
private:

};
```

> 其中B类拥有虚析构函数以及一个普通虚函数。我们生成解决方案，查看输出窗口。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E5%AF%B9%E6%AF%941.png)

### 解释

> 从图上往下解释：
>
> A这个类占用内存中的8个字节。其中有两个成员ab分别占了4个字节，他们的首地址偏移量为0和4。
>
> B这个类占用内存中的12个字节。其中发现了一个叫vfptr的成员(即虚函数表的指针)占用了4个字节。随后是两个成员ab分别占了4个字节，他们的首地址偏移量为4和8。
>
> B:: vftavle ，即B作用域中的虚函数表，在这个表中标记了两个虚函数，分别是dtor(destructor析构函数的缩写)，以及fun。
>
> ​	其中，在虚函数表中左边的编号不是占用的字节，而是函数的编号。

### 分析

> 1. 从内存分布来看，成员函数无论是否是virtual的，都不在类中，而成员变量则在。(类的非静态成员变量信息在栈上，函数在代码区里)
> 2. 当类中存在虚函数的时候，系统会给它分配一个虚函数表，里面记录了这个类拥有的虚函数的指针。
> 3. 当类中存在虚函数的时候，系统会给它分配一个虚函数表指针，用来指向2中的虚函数表，而这个虚函数表指针位于其内存的首位。(偏移量为0)

## 有虚函数类的单继承：重写与不重写

> 我们定一个基类A，拥有两个整形成员ab，以及虚析构函数和普通虚函数fun。
>
> 定义两个派生类SA1和SA2，它们各自拥有一个新整形成员c，其中SA2重写了基类A中的fun以及自己的析构函数。

```C++
class A
{
private:
	int a;
	int b;
public:
	virtual ~A(){}
	virtual void fun(){}
};

class SA1 :public A
{
private :
	int c;
};
class SA2 :public  A
{
private:
	int c;
public:
	virtual ~SA2(){}
	virtual void fun(){}
};
```

> 查看输出窗口

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E5%AF%B9%E6%AF%942.png)

### 解释

> 从图上往下解释：
>
> SA1这个类占用内存中的16个字节。其中先排布了基类A的成员信息，与上面第一张图一样，分别是虚函数表指针、成员a、b，分别占用4字节。随后是排布SA1自己的整形成员c，占用字节4。
>
> 随后是SA1的虚函数表，可以看到，虚函数表中的fun函数作用域是基类A。而析构函数是SA1本身。(C++中的类会默认帮你生成四个默认函数：构造、析构、浅拷贝、赋值(返回浅拷贝)，如果你自己实现了，则不会再生成)
>
> SA2这个类占用内存中的16个字节。内容排版和SA1一样。
>
> 随后是SA1的虚函数表，可以看到，虚函数表中的函数作用域都是是SA2本身。
>
> 因为我们重写了基类的虚函数。

### 分析

> 1. 派生类在内存的分布上，首先排布自己的基类成员信息，包含基类的虚函数表指针。基类成员信息的排版顺序和基类自身的一致。	
>
>    ​	随后才是自己的成员信息。
>
> 2. 内存会为拥有虚函数的基类的派生类再生成一个虚函数表，里面指名了虚函数，如果重写了虚函数，则会被覆盖。
>
> 3. 内存中存储基类信息中的虚函数指针不再指向基类的虚函数表，而是自己的虚函数表。

## 有虚函数基类的多重继承

> 多重继承就是爷爷->爸爸->儿子。简单理解为一条从上到下的线性继承。
>
> 我们定义三个类，也有这样的继承关系：A->B>C。
>
> 其中A有虚函数fun和fun1。
>
> B有虚函数fun2并重写虚函数fun1。
>
> C重写虚函数fun、fun1、fun2.

```C++
class A
{
private:
	int a;
public:
	virtual void fun(){}
	virtual void fun1(){}
};

class B :public A
{
private:
	int b;
public:
	virtual void fun1(){}
	virtual void fun2(){}
};

class C :public B
{
private:
	int c;
public:
	virtual void fun(){}
	virtual void fun2(){}
};
```

> 因为输出窗口截图太长了，所以直接赋值上来了

```
1>class A	size(8):
1>	+---
1> 0	| {vfptr}
1> 4	| a
1>	+---
1>
1>A::$vftable@:
1>	| &A_meta
1>	|  0
1> 0	| &A::fun
1> 1	| &A::fun1

...

1>class B	size(12):
1>	+---
1> 0	| +--- (base class A)
1> 0	| | {vfptr}
1> 4	| | a
1>	| +---
1> 8	| b
1>	+---
1>
1>B::$vftable@:
1>	| &B_meta
1>	|  0
1> 0	| &A::fun
1> 1	| &B::fun1
1> 2	| &B::fun2

...

1>class C	size(16):
1>	+---
1> 0	| +--- (base class B)
1> 0	| | +--- (base class A)
1> 0	| | | {vfptr}
1> 4	| | | a
1>	| | +---
1> 8	| | b
1>	| +---
1>12	| c
1>	+---
1>
1>C::$vftable@:
1>	| &C_meta
1>	|  0
1> 0	| &C::fun
1> 1	| &B::fun1
1> 2	| &C::fun2
```

### 解释

> 1. 基类A占用8个字节，分别是虚函数表指针和成员a。
>
>    ​	在虚函数表中，函数fun和fun1作用域都属于自己。
>
> 2. 派生类B占用12个字节，分别是基类A的虚函数表指针和成员a。加上自己的成员b。其中虚函数表指针指向自己的虚函数表而不是基类A。
>
>    ​	在虚函数表中，因为重写了虚函数fun1，并且新增一个虚函数fun2，基类A的虚函数fun的作用域属于A。
>
> 3. 派生类C占用16个字节，分别是基类A的虚函数表指针和成员a。和基类B的成员b，加上自己的成员c。其中虚函数表指针指向自己的虚函数表而不是基类B。
>
>    ​	在虚函数表中，因为重写了基类的所有的虚函数fun、2，作用域都是自己。保留未重写的虚函数fun1。因为fun1来自基类B，而B重写了来自基类A的虚函数fun1，所以在C中，fun1依然属于B类。

### 分析

> 1. 虚函数表中只会记录基类的虚函数地址(或被重写的)，以及自己的新虚函数地址。
> 2. 可以理解虚函数表中记录的虚函数地址都是相对于当前类最新的虚函数(即只要被重写的虚函数，都会替代)。

## 多继承与虚继承

### 多继承的二义性

> JAVA中没有多继承，为何？因为多继承容易造成二义性。
>
> 我们来看看下面的代码。
>
> 创建了三个基类ABC，其中ABC都有相同名字的虚函数fun以及相同名字的char类型成员x。

```C++
class A
{
public:
	char x = 'A';
	virtual void fun()  
	{
		cout << "来自A的fun" << endl;
	}
	virtual void funA() {}
};

class B
{
public:
	char x = 'B';
	virtual void fun()
	{
		cout << "来自B的fun" << endl;
	}
	virtual void funB() {}
};

class C
{
public:
	char x = 'C';
	virtual void fun()
	{
		cout << "来自C的fun" << endl;
	}
	virtual void funC() {}
};

class Son : A,  B,  C
{
	virtual void funSon(){}
};
```

> 我们再创建了一个派生类Son，多继承于A,B,C。
>
> 这个时候我们通过Son对象去访问fun函数和x成员会发生什么？

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E5%A4%9A%E7%BB%A7%E6%89%BF%E5%AF%BC%E8%87%B4%E7%9A%84%E4%B8%8D%E6%98%8E%E7%A1%AE.png)

> 不说编译器，就算是写出代码的我们，也不知道这个Son到底是指谁。
>
> 那我们向上转换呢，结果是当然，因为我们告诉了编译器，我们想要谁的函数和成员。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E5%90%91%E4%B8%8A%E8%BD%AC%E6%8D%A2%E4%B8%8D%E5%86%8D%E6%8A%A5%E9%94%99.png)

<center>向上转换后不再报错</center>

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E5%90%91%E4%B8%8A%E8%BD%AC%E6%8D%A2%E7%9A%84%E7%BB%93%E6%9E%9C.png)

<center>正确输出结果</center>

> 好，我们已经领略到多继承因同名而引发的二义性。这个时候我们看看这段代码在内存中的分布如何。

```
1>class A	size(8):
1>	+---
1> 0	| {vfptr}
1> 4	| x
1>  	| <alignment member> (size=3)
1>	+---
1>
1>A::$vftable@:
1>	| &A_meta
1>	|  0
1> 0	| &A::fun
1> 1	| &A::funA

...

1>class B	size(8):
1>	+---
1> 0	| {vfptr}
1> 4	| x
1>  	| <alignment member> (size=3)
1>	+---
1>
1>B::$vftable@:
1>	| &B_meta
1>	|  0
1> 0	| &B::fun
1> 1	| &B::funB

...

1>class C	size(8):
1>	+---
1> 0	| {vfptr}
1> 4	| x
1>  	| <alignment member> (size=3)
1>	+---
1>
1>C::$vftable@:
1>	| &C_meta
1>	|  0
1> 0	| &C::fun
1> 1	| &C::funC

...

1>class Son	size(24):
1>	+---
1> 0	| +--- (base class A)
1> 0	| | {vfptr}
1> 4	| | x
1>  	| | <alignment member> (size=3)
1>	| +---
1> 8	| +--- (base class B)
1> 8	| | {vfptr}
1>12	| | x
1>  	| | <alignment member> (size=3)
1>	| +---
1>16	| +--- (base class C)
1>16	| | {vfptr}
1>20	| | x
1>  	| | <alignment member> (size=3)
1>	| +---
1>	+---
1>
1>Son::$vftable@A@:
1>	| &Son_meta
1>	|  0
1> 0	| &A::fun
1> 1	| &A::funA
1> 2	| &Son::funSon
1>
1>Son::$vftable@B@:
1>	| -8
1> 0	| &B::fun
1> 1	| &B::funB
1>
1>Son::$vftable@C@:
1>	| -16
1> 0	| &C::fun
1> 1	| &C::funC
```

#### 解释

> 基类ABC不再多解释。
>
> 我们直接看派生类Son，在内存中，基类的信息按照多继承时的左到右的顺序排序，也就是A->B->C。
>
> 每一个基类成员中，都包含有指向对应虚函数表的指针以及一个char成员x。
>
> 然后有一段  <alignment member> (size=3)  的代码。在这里解释一下，是补充了3个字节的意思。
>
> (为什么是三个字节，因为在整个基类成员中，占位最大的是虚函数表指针，即4个字节，那么我们就需要按照它去对齐，所以在占有一个字节的char后面补充了三个字节，这是内存对齐的知识点)
>
> 随后是三张虚函数表，偏移量从0到-8再到-16。三张表中的虚函数地址都指对应自己类中的虚函数。
>
> 在第一个虚函数表中，多出了派生类的新虚函数。

#### 分析

> 在派生类对象调用相同名字的虚函数时，会产生二义性，编译器无法知道我们到底想调用哪一个虚函数表指针的虚函数。而向上转换后，明确的告诉编译器我们调用的虚函数指针是哪个基类成员中的，这样就能正确调用那个基类的虚函数。
>
> 派生类新增虚函数，放在声明的第一个基类的虚函数表中

#### 重写多继承中的虚函数

> 我们将上面的代码改成这样：重写Son中对ABC的虚函数fun

```
class Son : A, B, C
{
	virtual void fun()
	{
		cout << "来自Son的fun" << endl;
	}
};
```

> 查看内存分布：

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E9%87%8D%E5%86%99%E5%A4%9A%E7%BB%A7%E6%89%BF.png)

> 我们发现，派生类中对应基类A的虚表（虚函数表）的fun已经改变，作用域为Son。
>
> 而虚表B、C中的fun虚函数指针已经了一个goto语句，即将内存偏移x位到达虚表A，从A中读取fun函数。(编译器多聪明，不需要另建指针)。

---

### 虚继承

> 虚继承就是在继承时候在基类名字前加上 virtual 关键字。

#### 没有虚函数的虚继承多重继承(包含单继承)

```C++
class A
{
public:
	int x;
};
class B :virtual A
{
	int y;
};
class C :virtual B
{
	int z;
};
```

```
1>class A	size(4):
1>	+---
1> 0	| x
1>	+---
1>
1>class B	size(12):
1>	+---
1> 0	| {vbptr}
1> 4	| y
1>	+---
1>	+--- (virtual base A)
1> 8	| x
1>	+---
1>
1>B::$vbtable@:
1> 0	| 0
1> 1	| 8 (Bd(B+0)A)
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A       8       0       4 0
1>
1>class C	size(20):
1>	+---
1> 0	| {vbptr}
1> 4	| z
1>	+---
1>	+--- (virtual base A)
1> 8	| x
1>	+---
1>	+--- (virtual base B)
1>12	| {vbptr}
1>16	| y
1>	+---
1>
1>C::$vbtable@C@:
1> 0	| 0
1> 1	| 8 (Cd(C+0)A)
1> 2	| 12 (Cd(C+0)B)
1>
1>C::$vbtable@B@:
1> 0	| 0
1> 1	| -4 (Cd(B+0)A)
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A       8       0       4 0
1>               B      12       0       8 0
```

###### 解释

> 基类A占四个字节，即自身成员x。
>
> 派生类B占8个字节，多了一个vbptr(虚基表指针)的指针，随后是自己的成员y，才到A类中的成员x。
>
> vbtable字段中的值代表访问某个虚基表的内存偏移量。
>
> 
>
> vbi字段：
>
> class ：虚基表的类名
>
> offset：内存偏移量
>
> vbptr：虚基表指针位置
>
> vbte：母鸡0 0
>
> fvtorDisp: 下面引用于[关于vtordisp知多少？](<https://www.cnblogs.com/fanzhidongyzby/archive/2013/01/14/2860015.html>)
>
> ---
>
> MSDN给出的解释是：**虚继承中派生类重写了基类的虚函数，并且在构造函数或者析构函数中使用指向基类的指针调用了该函数，编译器会为虚基类添fVtorDisp域。**
>
> 然而，经过VS2010的测试，我们发现上述示例代码便会产生vtordisp字段！条件是。
>
> 1. 派生类重写了虚基类的虚函数。
>
> 2. 派生类定义了构造函数或者析构函数。
>
> ---

###### 分析

> 我们看到，只要虚继承于一个基类，就会为其创建一个虚基表，并且在内存首部生成一个虚基表指针。
>
> 而且，派生类的成员变量内存分布永远在前面(在虚基表指针的后面)，其次是基类的基类成员(如果有)，再到基类的成员。
>
> 下面引用于[C++ 继承之虚继承与普通继承的内存分布](<https://www.cnblogs.com/yanqi0124/p/3830433.html>)
>
> ---
>
> 1. 普通继承情况下，先父类元素后子类元素，若父类元素本身也是从某个爷爷类继承而来：父类是虚继承而来，则先父后子再爷爷（其实这个分布是满足规则2的）,即爷爷放在最后；父类是普通继承而来，先爷爷后父再子，即爷爷放在前面。
> 2. 虚继承情况下，先子类元素后父类元素，如果父类元素本身也是从某个爷爷类继承（不论是虚继承还是普通继承）而来，则父类由类的深到浅依次分布（先爷爷后父，爷爷在子和父之间）。
>
> ---

#### 有虚函数的虚继承多重继承(包含单继承)

> 新建三个基类ABC，每个基类拥有自己不同名的成员变量。每个基类都有自己的虚函数。
>
> ABC父子关系为A->B->C。
>
> 其中BC重写A的虚函数fun。
>
> 派生类D重写所有虚函数。

```C++
class A
{
public:
	int a;
	virtual void fun() {}
	virtual void funA(){};
};
class B :virtual A
{
public:
	int b;
	virtual void fun() {}
	virtual void funB() {};
};
class C :virtual B
{
public:
	int c;
	virtual void fun() {}
	virtual void funC() {};
};
class D :virtual C
{
public:
	int d;
	virtual void fun() {}
	virtual void funA() {}
	virtual void funB() {}
	virtual void funC() {};
};
```

```
1>class A	size(8):
1>	+---
1> 0	| {vfptr}
1> 4	| a
1>	+---
1>
1>A::$vftable@:
1>	| &A_meta
1>	|  0
1> 0	| &A::fun
1> 1	| &A::funA
1>
1>class B	size(20):
1>	+---
1> 0	| {vfptr}
1> 4	| {vbptr}
1> 8	| b
1>	+---
1>	+--- (virtual base A)
1>12	| {vfptr}
1>16	| a
1>	+---
1>
1>B::$vftable@B@:
1>	| &B_meta
1>	|  0
1> 0	| &B::funB
1>
1>B::$vbtable@:
1> 0	| -4
1> 1	| 8 (Bd(B+4)A)
1>
1>B::$vftable@A@:
1>	| -12
1> 0	| &B::fun
1> 1	| &A::funA
1>
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A      12       4       4 0
1>
1>class C	size(32):
1>	+---
1> 0	| {vfptr}
1> 4	| {vbptr}
1> 8	| c
1>	+---
1>	+--- (virtual base A)
1>12	| {vfptr}
1>16	| a
1>	+---
1>	+--- (virtual base B)
1>20	| {vfptr}
1>24	| {vbptr}
1>28	| b
1>	+---
1>
1>C::$vftable@:
1>	| &C_meta
1>	|  0
1> 0	| &C::funC
1>
1>C::$vbtable@C@:
1> 0	| -4
1> 1	| 8 (Cd(C+4)A)
1> 2	| 16 (Cd(C+4)B)
1>
1>C::$vftable@A@:
1>	| -12
1> 0	| &C::fun
1> 1	| &A::funA
1>
1>C::$vftable@B@:
1>	| -20
1> 0	| &B::funB
1>
1>C::$vbtable@B@:
1> 0	| -4
1> 1	| -12 (Cd(B+4)A)
1>
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A      12       4       4 0
1>               B      20       4       8 0
1>
1>class D	size(40):
1>	+---
1> 0	| {vbptr}
1> 4	| d
1>	+---
1>	+--- (virtual base A)
1> 8	| {vfptr}
1>12	| a
1>	+---
1>	+--- (virtual base B)
1>16	| {vfptr}
1>20	| {vbptr}
1>24	| b
1>	+---
1>	+--- (virtual base C)
1>28	| {vfptr}
1>32	| {vbptr}
1>36	| c
1>	+---
1>
1>D::$vbtable@:
1> 0	| 0
1> 1	| 8 (Dd(D+0)A)
1> 2	| 16 (Dd(D+0)B)
1> 3	| 28 (Dd(D+0)C)
1>
1>D::$vftable@A@:
1>	| -8
1> 0	| &D::fun
1> 1	| &D::funA
1>
1>D::$vftable@B@:
1>	| -16
1> 0	| &D::funB
1>
1>D::$vbtable@B@:
1> 0	| -4
1> 1	| -12 (Dd(B+4)A)
1>
1>D::$vftable@:
1>	| -28
1> 0	| &D::funC
1>
1>D::$vbtable@C@:
1> 0	| -4
1> 1	| -24 (Dd(C+4)A)
1> 2	| -16 (Dd(C+4)B)
1>
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A       8       0       4 0
1>               B      16       0       8 0
1>               C      28       0      12 0
```

##### 解释

> A因为没有虚继承，有虚函数，所以拥有一个虚函数表指针以及虚函数表，
>
> B因为虚继承于A，拥有虚基表以及虚基表、虚函数表指针以及基类成员，因为是虚继承且有新的虚函数，所以拥有一个自己虚函数表以及指针。
>
> ​	其中基类的虚函数表记录从基类继承的虚函数地址，即使以被自己重写。
>
> ​	自己的虚函数表仅记录自己的新增虚函数地址。
>
> C因为虚继承于B，拥有虚基表以及虚基表、虚函数表指针以及基类成员，因为是虚继承且有新的虚函数，所以拥有一个自己虚函数表以及指针。
>
> ​	因为B也是虚继承于A，所以在派生类C的内存中B的成员信息中拥有对应的虚基表指针。
>
> ​	其中基类的虚函数表记录从基类继承的虚函数地址，即使以被自己重写。
>
> ​	自己的虚函数表仅记录自己的新增虚函数地址。

##### 疑问

> D也如此，但是在VS输出的信息中，D却拥有了自己的虚函数表地址，并且有一个虚函数地址是指向基类C的函数funC。。 (上述的  D::\$vftable@:    ， 不应该是  D::\$vftable@c@:么)
>
> 但是通过VS断点去查看局部变量的地址，发现D是没有自己的虚函数地址的，而D中C类成员的虚函数表指针可以看到funC。所以可能是VS抽风了？

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/VS%E6%8A%BD%E9%A3%8E.png)

##### 分析

> 不难看出，虚继承很智能的把虚函数的起源分开了，也就是很智能的将虚函数指针放在第一个提出某个虚函数的基类虚函数表中。

#### 虚基表的作用：菱形继承问题

> 有下面的代码

```

class A
{
public:
	int a;
};
class B :  public A
{
public:
	int b;
};
class C :   public A
{
public:
	int c;
};

class D :public B, public C
{

};
```

> 如果我们尝试访问D类的对象中的a成员，会发生什么事情呢。

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E8%8F%B1%E5%BD%A2%E7%BB%A7%E6%89%BF%E9%97%AE%E9%A2%98.png)

> 很显然产生了二义性，因为B和C都继承有A的成员a，我们多继承于BC，那么这两个a，编译器不知道到底选谁。
>
> 让我们看看内存排布：

```
1>class A	size(4):
1>	+---
1> 0	| a
1>	+---
1>
1>class B	size(8):
1>	+---
1> 0	| +--- (base class A)
1> 0	| | a
1>	| +---
1> 4	| b
1>	+---
1>
1>class C	size(8):
1>	+---
1> 0	| +--- (base class A)
1> 0	| | a
1>	| +---
1> 4	| c
1>	+---
1>
1>class D	size(16):
1>	+---
1> 0	| +--- (base class B)
1> 0	| | +--- (base class A)
1> 0	| | | a
1>	| | +---
1> 4	| | b
1>	| +---
1> 8	| +--- (base class C)
1> 8	| | +--- (base class A)
1> 8	| | | a
1>	| | +---
1>12	| | c
1>	| +---
1>	+---
```

##### 解释

> 我们可以看到D类的内存分布，出现了两个a成员，分别来源于B->A和C->A。

##### 使用虚继承的虚基表解决问题

> 改成下面的代码：

```
class A
{
public:
	int a;
};
class B : virtual public A
{
public:
	int b;
};
class C : virtual  public A
{
public:
	int c;
};

class D :public B, public C
{

};
```

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/%E8%99%9A%E5%87%BD%E6%95%B0/%E8%99%9A%E7%BB%A7%E6%89%BF%E8%A7%A3%E5%86%B3%E8%8F%B1%E5%BD%A2%E7%BB%A7%E6%89%BF.png)

<center>不再报错</center>

> 查看内存分布

```
1>class A	size(4):
1>	+---
1> 0	| a
1>	+---
1>
1>class B	size(12):
1>	+---
1> 0	| {vbptr}
1> 4	| b
1>	+---
1>	+--- (virtual base A)
1> 8	| a
1>	+---
1>
1>B::$vbtable@:
1> 0	| 0
1> 1	| 8 (Bd(B+0)A)
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A       8       0       4 0
1>
1>class C	size(12):
1>	+---
1> 0	| {vbptr}
1> 4	| c
1>	+---
1>	+--- (virtual base A)
1> 8	| a
1>	+---
1>
1>C::$vbtable@:
1> 0	| 0
1> 1	| 8 (Cd(C+0)A)
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A       8       0       4 0
1>
1>class D	size(20):
1>	+---
1> 0	| +--- (base class B)
1> 0	| | {vbptr}
1> 4	| | b
1>	| +---
1> 8	| +--- (base class C)
1> 8	| | {vbptr}
1>12	| | c
1>	| +---
1>	+---
1>	+--- (virtual base A)
1>16	| a
1>	+---
1>
1>D::$vbtable@B@:
1> 0	| 0
1> 1	| 16 (Dd(B+0)A)
1>
1>D::$vbtable@C@:
1> 0	| 0
1> 1	| 8 (Dd(C+0)A)
1>vbi:	   class  offset o.vbptr  o.vbte fVtorDisp
1>               A      16       0       4 0
```

##### 解释

> 	1>class D	size(20):
> 	1>	+---
> 	1> 0	| +--- (base class B)
> 	1> 0	| | {vbptr}//起始偏移量地址为0
> 	1> 4	| | b
> 	1>	| +---
> 	1> 8	| +--- (base class C)
> 	1> 8	| | {vbptr}//起始偏移量为8
> 	1>12	| | c
> 	1>	| +---
> 	1>	+---
> 	1>	+--- (virtual base A) //这里存储了A类成员信息
> 	1>16	| a//我们想要访问的成员 它在内存的偏移量为16
> 	1>	+---
> 	1>
> 	1>D::$vbtable@B@://D中的B虚基表，它记录了访问虚继承基类A的成员信息的内存偏移量
> 	1> 0	| 0
> 	1> 1	| 16 (Dd(B+0)A)//偏移16
> 	1>
> 	1>D::$vbtable@C@://D中的C虚基表，它记录了访问虚继承基类A的成员信息的内存偏移量
> 	1> 0	| 0
> 	1> 1	| 8 (Dd(C+0)A)//偏移16

> 我们看到B的虚基表指针的偏移量为0，而它要访问的虚基表显示偏移量为16。0+16=16。
>
> C的虚基表指针的偏移量为8，而它要访问的虚基表显示偏移量为8。8+8=16。
>
> 显然他们都指向同一个内存偏移量为16的内容，即A类中的a成员。

##### 分析

> 虚基表保存了虚继承基类成员的内存偏移量，访问的时候通过偏移访问，保证都是访问同一个数据。

## 总结

> 1. 无虚继承
>    1. 存在新的虚函数时，会创建一个虚函数表和虚函数表指针。
>    2. 在多重继承中，最后的派生类只有一个虚函数表和指针。
>    3. 在多继承中，有多少个虚继承的基类，就有多少个对应的虚函数表和虚函数表指针。自己的新虚函数地址存放在最左边的基类的虚函数表中。
> 2. 虚继承多
>    1. 重继承中，有多少个虚继承的基类，就有多少个对应的虚函数表和虚函数表指针。同时如果自己拥有新的虚函数，那么将存在一个自己的虚函数表和虚函数指针。
>    2. 内存的排版为先子类成员后父类成员，即当前派生类的成员变量最先，然后按照基类的祖父类成员再到基类成员排序。
> 3. 派生类重写了父类的虚函数时，对应的虚函数表中的虚函数地址以及作用域会被更改为当前派生类。
> 4. 在内存排版中的同一个类的作用域中，虚函数表指针vfptr永远在虚基表指针vbptr的前面，虚基表指针永远在其他成员变量前面。
> 5. 虚基表保存了虚继承基类成员的内存偏移量，访问的时候通过偏移访问，保证都是访问同一个数据。
> 6. 虚函数真乱啊。。。