---
title: <学习记录>处理器调度
date: 2019-3-31 20:23:43
tags: 知识总结
categories: 操作系统
copyright: true
keywords: [操作系统,作业调度,线程]
description: 总结处理器调度的三个层次，几种常见的调度算法以及实现。
---
## 处理器调度层次

> 本篇基于进程和线程，进程和线程的相关知识可以参考另一篇[文章](<http://confusel.tech/2019/MyLearn-ProcessAndThreadAndCoroutine/>)。

### 1.高级调度

#### 作用

> 可称为作业调度、长程调度 ，简单来说，就是从后备作业(可以理解为待安排的程序)中按照一定的调度策略选择若干个作业进入内存，开始为他们创建进程和分配资源。
>
> 同时在作业完成时做好善后工作，比如回收资源。

#### 调用时机

> 当CPU空闲时间超过一定阀值，此时系统便调用高级调度，开始安排新作业。

### 2.中级调度

#### 作用

> 可称为平衡调度、中程调度，简单来说会把暂时不能运行的进程挂起，将它占用的资源释放，当资源充足的时候，解除这个进程的挂起状态，为它恢复资源。

#### 调用时机

> 当内存吃紧时调用中级调度。

### 3.低级调度

#### 作用

> 可称为进程调度、线程调度、短程调度，简单来说，它会根据某种原则决定在内存中所有进程使用cpu的顺序，可以说它是操作系统最核心的调度，几乎每时每刻都在被执行。

#### 调用时机

> 当cpu空闲时，说明这个时候cpu还可以被利用。
>
> 如果有某个进程的优先级别比当前使用cpu的进程还高，而且调度算法允许被抢占时，优先的那个进程将会抢占cpu。

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554036387852&di=fadc94933d3facd8fa64d7d5ebfea650&imgtype=0&src=http%3A%2F%2Fupload-images.jianshu.io%2Fupload_images%2F8803909-0db744b9da1a2a2a.png)

## 调度性能指标

### 资源利用率

#### 公式

​	CPU利用率=CPU有效工作时间/CPU总的运行时间
​	CPU总的运行时间=CPU有效工作时间+CPU空闲等待时间
​	即CPU利用率=CPU有效工作时间/(CPU有效工作时间+CPU空闲等待时间)

### 吞吐率

> 单位时间内cpu处理作业的个数。
>
> 如果处理的作业中，长作业比较多，那么相对来说，单位时间内它能处理的作业就很少，因为长作业一直做不完。此时吞吐率低。
>
> 如果处理的作业中，短作业比较多，那么相对来说，单位时间内它能处理的作业就很多，因为短作业很容易做完。此时吞吐率高。
>
> 作业长短指的是执行这个作业的必要时间的长短。
>
> 是批处理系统的重要衡量指标之一。

### 公平性

> 确保每个进程都能得到合理的CPU份额和资源份额。否则会产生进程饥饿。
>
> 进程饥饿：某个进程从创建开始到某个时间，就一直没有使用cpu的权限，那么这个进程是没有存在的意义，也就是进程饥饿。

### 响应时间

> 从交互式进程提交一个请求到获得响应之间的时间间隔。
>
> 是分时、实时系统的重要衡量指标之一。

### 周转时间

> 从系统提交作业开始到作业完成为止的时间间隔。

#### 公式

1.  第i个作业的周转时间ti=作业i的完成时刻f-作业的提交时刻s。
   1. ti=tf-ts;
2. 平均周转时间T=所有作业的周转时间相加之合/作业个数n。
   1. T=($\sum_{i=1}^N$ti)/n
3. 第i个作业的带权周转时间wi=第i个作业的周转时间ti/第i个作业的必要消耗时间tk
   1. wi=ti/tk
4. 平均带权周转时间W=所有作业的带权周转时间相加之合/作业个数n。
   1. W=($\sum_{i=1}^N$wi)/n

## 作业调度和低级调度算法

### 先来先服务算法(FCFS)

#### 概述

> 字如其名，谁先到谁先服务，也类似数据结构中的队列，不按权值，先进先出。
>
> 非抢占式。

#### 案例

> 如下标，有三个作业按1 2 3的顺序进入后备作业，这个时候因为作业1先来，所以运行它，随后是2和3。


| 作业名 | 所需CPU时间/ms |
| ------ | -------------- |
| 作业1  | 28             |
| 作业2  | 9              |
| 作业3  | 3              |

| 0-28s | 28-37s | 37-40s |
| ----- | ------ | ------ |
| 作业1 | 作业2  | 作业3  |

#### 代码

```c++
/*!***************************************************
 * @file: FCFS.cpp
 * @brief: 博客-操作系统调度算法-先来先服务
 * @author: ConfuseL
 * @date: 3,31,2019
 * @note:
 ****************************************************/
#include <bits/stdc++.h>
using namespace std;
//所有作业提交到系统的时间
const double beginTime=0;
//系统时间
double systemTime=0;
class Job
{
 private:
    //作业号
        int id;
    //所需CPU的时间
        double workTime;
    //获得CPU运作权限的时间
        double getCount;
    //结束时间
        double finishTime;
    //进入内存的时间
        double pushTime;
    //到达系统的时间
    double arrival;
    public:
        Job(){};
        Job(int id,double wT)
        {
            this->id=id;
            workTime=wT;
            getCount=0;
            finishTime=0;
            pushTime=0;
            arrival=0;
        }
    friend ostream& operator<<(ostream& out, Job &j)
    {
            j.setFinishTime(systemTime);
        out<<"作业"<<j.id<<": 所需CPU时间："<<j.workTime<<"ms，进入时间："<<j.pushTime<<"ms，周转时间："<<j.finishTime-j.arrival<<endl;
        return out;
    }
    //是否以完成
     bool isDone()
     {
         //当获取CPU运作权限时间大于等于工作所需要的时间，即完成。
         return getCount>=workTime;
     }
         //设置结束时间
     void setFinishTime(double finishTime)
     {
        this->finishTime=finishTime;
     }
    //获得CPU运作时间，一次1ms
     void getCPUTime(double& systemTime)
     {
         getCount+=1.0;
         systemTime+=1.0;
         finishTime+=1.0;
     }
    //设置进入内存时间
     void setPushTime(double pushTime)
     {
         this->pushTime=pushTime;
         //结束时间从进入内存时间开始累加
         finishTime=pushTime;
     }
    //获得结束时间
     double getFinishTime()
     {
         return finishTime;
     }
    //获得工作时间
     double getWorkTime()
     {
         return workTime;
     }
         //获得提交时间
     double getArrivalTime()
     {
         return arrival;
     }
};

int main()
{
    //平均周转和平均带权周转
    double T=0,W=0;
    //后备作业个数个数
    int jobNum=3;
    //后备作业队列
    queue<Job> JobPool;
    //当前运行的作业
    Job curJob;
    //测试，后备作业中有以下几个作业
    JobPool.push(*(new Job(1,28)));
    JobPool.push(*(new Job(2,9)));
    JobPool.push(*(new Job(3,3)));
    //开始取作业，按照先进先出(队列特性)
    while(!JobPool.empty())
    {
        curJob=JobPool.front();
        JobPool.pop();
        curJob.setPushTime(systemTime);
        //如果作业没有完成
        while(!curJob.isDone())
        {
            //给它一次运行时间(1ms)
            curJob.getCPUTime(systemTime);
        }
        cout<<curJob;
        T+=(curJob.getFinishTime()-curJob.getArrivalTime())/jobNum;
        W+=((curJob.getFinishTime()-curJob.getArrivalTime())/curJob.getWorkTime())/jobNum;
    }
    cout<<"平均周转时间："<<T<<"ms,"<<"平均带权周转时间："<<W<<"ms"<<endl;
    return 0;
}
```


![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/OS/FCFS.png)

### 最短作业优先算法

#### 概述

> 每次取所需时间最短的作业，当系统彻底空闲的时候取第一个，随后在第一个执行完毕后，检索等待的作业中所需CPU时间最短的作业，然后执行它。
>
> 非抢占式。
>
> 会造成进程饥饿，所需时间越多的就需要等待越久。

#### 案例

> 如下标，有四个作业，它们同时进入后备作业，此时由于作业2所需时间最短，所以先运行作业2。
>
> 其次是作业4，1，3。


| 作业名 | 所需CPU时间/ms |
| ------ | -------------- |
| 作业1  | 9              |
| 作业2  | 4              |
| 作业3  | 10             |
| 作业4  | 8              |

| 0-4s  | 4-12s | 12-21s | 21-31s |
| ----- | ----- | ------ | ------ |
| 作业2 | 作业4 | 作业1  | 作业3  |

#### 代码

> 直接把上面FCFS的队列改成最小优先队列就好了。

```C++
/*!***************************************************
 * @file: SJF.cpp
 * @brief: 博客-操作系统调度算法-最短作业有限
 * @author: ConfuseL
 * @date: 3,31,2019
 * @note:
 ****************************************************/
#include <bits/stdc++.h>
using namespace std;
//系统时间
double systemTime=0;
class Job
{
    private:
    //作业号
        int id;
    //所需CPU的时间
        double workTime;
    //获得CPU运作权限的时间
        double getCount;
    //结束时间
        double finishTime;
    //进入内存的时间
        double pushTime;
    //到达系统的时间
    double arrival;
    public:
        Job(){};
        Job(int id,double wT)
        {
            this->id=id;
            workTime=wT;
            getCount=0;
            finishTime=0;
            pushTime=0;
            arrival=0;
        }
    friend ostream& operator<<(ostream& out, Job &j)
    {
            j.setFinishTime(systemTime);
        out<<"作业"<<j.id<<": 所需CPU时间："<<j.workTime<<"ms，进入时间："<<j.pushTime<<"ms，周转时间："<<j.finishTime-j.arrival<<endl;
        return out;
    }
	//重载小于操作符 让时间小的优先
	friend bool operator < (const Job & a,const Job &b)
	{
		return a.workTime>b.workTime;
	}

    //是否以完成
     bool isDone()
     {
         //当获取CPU运作权限时间大于等于工作所需要的时间，即完成。
         return getCount>=workTime;
     }
    //获得CPU运作时间，一次1ms
     void getCPUTime(double& systemTime)
     {
         getCount+=1.0;
         systemTime+=1.0;
     }
    //设置进入内存时间
     void setPushTime(double pushTime)
     {
         this->pushTime=pushTime;
     }
    //设置结束时间
     double setFinishTime(double finishTime)
     {
        this->finishTime=finishTime;
     }
    //获得结束时间
     double getFinishTime()
     {
         return finishTime;
     }
    //获得工作时间
     double getWorkTime()
     {
         return workTime;
     }
    //获得提交时间
     double getArrivalTime()
     {
         return arrival;
     }
};

int main()
{
    //平均周转和平均带权周转
    double T=0,W=0;
    //后备作业个数个数
    int jobNum=4;
    //后备作业队列
    priority_queue<Job> JobPool;
    //当前运行的作业
    Job curJob;
    //测试，后备作业中有以下几个作业
    JobPool.push(*(new Job(1,9)));
    JobPool.push(*(new Job(2,4)));
    JobPool.push(*(new Job(3,10)));
    JobPool.push(*(new Job(4,8)));
    //开始取作业，按照先进先出(队列特性)
    while(!JobPool.empty())
    {
        curJob=JobPool.top();
        JobPool.pop();
        curJob.setPushTime(systemTime);
        //如果作业没有完成
        while(!curJob.isDone())
        {
            //给它一次运行时间(1ms)
            curJob.getCPUTime(systemTime);
        }
        cout<<curJob;
        T+=(curJob.getFinishTime()-curJob.getArrivalTime())/jobNum;
        W+=((curJob.getFinishTime()-curJob.getArrivalTime())/curJob.getWorkTime())/jobNum;
    }
    cout<<"平均周转时间："<<T<<"ms,"<<"平均带权周转时间："<<W<<"ms"<<endl;
    return 0;
}
```

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/OS/SJF.png)

### 最短剩余时间优先算法

#### 概述

> 这个算法其实是上面最短作业优先算法的抢占版，最短优先算法规定了每一次执行最短需求的作业，直到它完毕，但是在最短剩余时间优先算法中，每当一个新作业进入到后备内存时，就得比较当前执行的作业和后备作业中谁的需求时间最短了。

#### 案例

> 如下表，四个作业分时到达。作业1最先到达，执行了1ms，随后被到来的作业2抢占，因为作业2只需要4ms，而作业1还需要7ms。
>
> 以此类推。

| 作业名 | 到达系统时间 | 所需CPU时间/ms |
| ------ | ------------ | -------------- |
| 作业1  | 0            | 8              |
| 作业2  | 1            | 4              |
| 作业3  | 2            | 9              |
| 作业4  | 3            | 5              |

| 0-1MS | 1-5MS | 5-10MS | 10-17MS | 17-26MS |
| ----- | ----- | ------ | ------- | ------- |
| 作业1 | 作业2 | 作业4  | 作业1   | 作业3   |

#### 代码

```C++
/*!***************************************************
 * @file: SRTF.cpp
 * @brief: 博客-操作系统调度算法-最短剩余时间优先
 * @author: ConfuseL
 * @date: 4,1,2019
 * @note:
 ****************************************************/
#include <bits/stdc++.h>
using namespace std;
//系统时间
double systemTime=0;
class Job
{
    private:
    //作业号
        int id;
    //所需CPU的时间
        double workTime;
    //获得CPU运作权限的时间
        double getCount;
    //结束时间
        double finishTime;
    //第一次进入内存的时间
        double pushTime;
    //到达系统的时间
        double arrival;
    public:
        Job(){};
        Job(int id,double ar,double wT)
        {
            this->id=id;
            workTime=wT;
            arrival=ar;
            getCount=0;
            finishTime=0;
            pushTime=-1;
        }
    friend ostream& operator<<(ostream& out, Job &j)
    {
        //当它结束的时候输出，这时候设置结束时间。
        j.setFinishTime(systemTime);
        out<<"作业"<<j.id<<": 提交时间："<<j.arrival<<"ms, 所需CPU时间："<<j.workTime<<"ms，进入内存时间："<<j.pushTime<<"ms，周转时间："<<systemTime-j.arrival<<endl;
        return out;
    }
	//重载小于操作符 让剩余时间小的优先
	friend bool operator < (const Job & a,const Job &b)
	{
		return a.getSurplusTime()>b.getSurplusTime();
	}

    //是否以完成
     bool isDone()
     {
         //当获取CPU运作权限时间大于等于工作所需要的时间，即完成。
         return getCount>=workTime;
     }
    //设置结束时间
     void setFinishTime(double finishTime)
     {
        this->finishTime=finishTime;
     }
    //获得CPU运作时间，一次1ms
     void getCPUTime(double& systemTime)
     {
         getCount+=1.0;
         systemTime+=1.0;
     }
    //设置第一次进入内存时间
     void setPushTime(double pushTime)
     {
         //如果小于0代表第一次进
         if(this->pushTime<0)
            this->pushTime=pushTime;
     }
    //获得进入内存时间
     double getPushTime()
     {
         return pushTime;
     }
    //获得结束时间
     double getFinishTime()
     {
         return finishTime;
     }
    //获得提交时间
     double getArrivalTime()
     {
         return arrival;
     }
    //获得工作时间
     double getWorkTime()
     {
         return workTime;
     }
    //获得剩余工作时间
     double  getSurplusTime() const
     {
         return workTime-getCount;
     }
};

//当前运行的作业，在这里用静态指针的原因是因为我们需要对每一次进来的作业和当前的作业进行对比甚至替换，如果在传参中声明并不能更改原来的地址，而引用做为传参却无法指向引用(队列top返回的是引用)。
Job *curJob=NULL;

void judge(priority_queue<Job> &jobPool,Job &newJob)
{
    //如果为空并且当前没有作业 代表第一个作业 不用推入队列 直接变成当前作业
    if(jobPool.empty()&&curJob==NULL)
    {
        curJob=&newJob;
        if(curJob->getPushTime()<1e8)
            curJob->setPushTime(systemTime);
        return;
    }
    //否则推入
    else
    jobPool.push(newJob);
    //判断当前和队列头部的那个剩余时间最少，然后替换
    if(jobPool.top().getSurplusTime()<curJob->getSurplusTime())
    {
        jobPool.push(*curJob);
        *(curJob)=jobPool.top();
        jobPool.pop();
        if(curJob->getPushTime()<1e8)
        curJob->setPushTime(systemTime);
    }
}

int main()
{
    //平均周转和平均带权周转
    double T=0,W=0;
    //后备作业个数个数
    int jobNum=4;
    //后备作业队列
    priority_queue<Job> JobPool;
    //开始取作业，按照先进先出(队列特性)
    do
    {
        //因为知道是四个作业 所以直接打表了 如果作业很多 就要另写了
        switch((int)systemTime)
        {
                    case 0:
                            judge(JobPool,*(new Job(1,0,8)));
            break;
                    case 1:
                            judge(JobPool,*(new Job(2,1,4)));
            break;
                    case 2:
                            judge(JobPool,*(new Job(3,2,9)));
            break;
                    case 3:
                            judge(JobPool,*(new Job(4,3,5)));
            break;
        }
        //给它一次运行时间(1ms)
        curJob->getCPUTime(systemTime);
        //如果作业完成
        if(curJob->isDone())
        {
        //输出相关信息
        cout<<*curJob;
        T+=(curJob->getFinishTime()-curJob->getArrivalTime())/jobNum;
        W+=((curJob->getFinishTime()-curJob->getArrivalTime())/curJob->getWorkTime())/jobNum;
        //读取新作业
        if(!JobPool.empty())
        {
        *(curJob)=JobPool.top();
        JobPool.pop();
        curJob->setPushTime(systemTime);
        }
        }
    }
    while(!curJob->isDone()||!JobPool.empty());
    cout<<"平均周转时间："<<T<<"ms,"<<"平均带权周转时间："<<W<<"ms"<<endl;
    return 0;
}
```

![](http://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/OS/SRTF.png)



### 最高响应比优先算法

#### 概述

> 一种即考虑作业等待时间，又考虑作业处理时间的非抢占式调度算法。
>
> 以响应比为因素，决定作业的优先情况。
>
> 响应比=作业周转时间/作业处理时间
>
> ​		=(作业等待时间+作业处理时间)/作业处理时间
>
> ​		=1+作业等待时间/作业处理时间
>
> 在代码中，这个1往往可以忽略掉。

#### 案例

> 如下表，四个作业分时到达。作业1最先到达，执行了20ms。
>
> 在这个期间，作业234全部到达系统，位于后备作业中。
>
> 当1结束，作业2的等待时间为15ms，作业3的等待时间为10ms，作业4为5ms。
>
> 各自除以各自的所需时间，得响应比为：作业2：1，作业3：2，作业4：0.5。
>
> 因此选中作业3直到执行完毕。
>
> 以此类推。

| 作业名 | 到达系统时间 | 所需CPU时间/ms |
| ------ | ------------ | -------------- |
| 作业1  | 0            | 20             |
| 作业2  | 5            | 15             |
| 作业3  | 10           | 5              |
| 作业4  | 15           | 10             |

| 0-20MS | 20-25MS | 25-40MS | 40-50MS |
| ------ | ------- | ------- | ------- |
| 作业1  | 作业3   | 作业2   | 作业4   |

#### 代码

```C++
/*!***************************************************
 * @file: HRRF.cpp
 * @brief: 博客-操作系统调度算法-最高响应比优先
 * @author: ConfuseL
 * @date: 4,3,2019
 * @note:
 ****************************************************/
#include <bits/stdc++.h>
using namespace std;
//系统时间
double systemTime=0;
const double dbMin=0.0000001;
class Job
{
    private:
    //作业号
        int id;
    //以获得的工作时间
        double workTime;
    //获得CPU运作权限的时间
        double getCount;
    //结束时间
        double finishTime;
    //进入内存的时间
        double pushTime;
    //到达系统的时间
        double arrival;
        //等待时间
        double await;
    public:
        Job(){};
        Job(int id,double ar,double wT)
        {
            this->id=id;
            workTime=wT;
            arrival=ar;
            getCount=0;
            finishTime=0;
            pushTime=-1;
        }
    friend ostream& operator<<(ostream& out, Job &j)
    {
            j.setFinishTime(systemTime);
        out<<"作业"<<j.id<<": 所需CPU时间："<<j.workTime<<"ms，进入时间："<<j.pushTime<<"ms，周转时间："<<j.finishTime-j.arrival<<endl;
        return out;
    }
	//重载小于操作符 让响应比大的优先
	friend bool operator < (const Job & a,const Job &b)
	{
		return a.getAwait()/a.getWorkTime()-b.getAwait()/b.getWorkTime()>dbMin;
	}

    //是否以完成
     bool isDone()
     {
         //当获取CPU运作权限时间大于等于工作所需要的时间，即完成。
         return getCount>=workTime;
     }
    //获得CPU运作时间，一次1ms
     void getCPUTime(double& systemTime)
     {
         getCount+=1.0;
         systemTime+=1.0;
     }
    //设置进入内存时间
     void setPushTime(double pushTime)
     {
         this->pushTime=pushTime;
     }
    //设置等待时间
     void setAwaitTime(double awaitTime)
     {
         this->await=awaitTime;
     }
    //设置结束时间
     void setFinishTime(double finishTime)
     {
        this->finishTime=finishTime;
     }
    //获得结束时间
     double getFinishTime()
     {
         return finishTime;
     }
    //获得工作时间
     double getWorkTime()const
     {
         return workTime;
     }
    //获得提交时间
     double getArrivalTime()
     {
         return arrival;
     }
     double getAwait()const
     {
         return await;
     }
};

int main()
{
    //平均周转和平均带权周转
    double T=0,W=0;
    //后备作业个数个数
    int jobNum=4;
    //后备作业向量 这里不用队列的原因是为了方便每一次的响应比计算
    vector<Job> JobPool;
    //当前运行的作业
    Job curJob=*(new Job(1,0,20));
    curJob.setPushTime(systemTime);
    //开始取作业，按照先进先出(队列特性)
    do
    {
        //因为知道是四个作业 所以直接打表了 如果作业很多 就要另写了
        switch((int)systemTime)
        {
                    case 5:
                        JobPool.push_back(*(new Job(2,5,15)));
            break;
                    case 10:
                        JobPool.push_back(*(new Job(3,10,5)));
            break;
                    case 15:
                        JobPool.push_back(*(new Job(4,15,10)));
            break;;
        }
        curJob.getCPUTime(systemTime);
        if(curJob.isDone())
        {
            cout<<curJob;
            T+=(curJob.getFinishTime()-curJob.getArrivalTime())/jobNum;
            W+=((curJob.getFinishTime()-curJob.getArrivalTime())/curJob.getWorkTime())/jobNum;
            //为每一个作业刷新等待时间
            for(int i=0;i<JobPool.size();i++)
            {
                JobPool[i].setAwaitTime(curJob.getFinishTime()-JobPool[i].getArrivalTime());
            }
            //排序 取首个 也就是响应比最大的那个
            if(!JobPool.empty())
            {
                sort(JobPool.begin(),JobPool.end());
                curJob=JobPool[0];
                curJob.setPushTime(systemTime);
                JobPool.erase(JobPool.begin());
            }
        }
    }
        while(!curJob.isDone()||!JobPool.empty());
    cout<<"平均周转时间："<<T<<"ms,"<<"平均带权周转时间："<<W<<"ms"<<endl;
    return 0;
}

```

![](https://confusel-images.oss-cn-shenzhen.aliyuncs.com/%E5%8D%9A%E5%AE%A2%E5%9B%BE%E5%BA%93/OS/HRRF.png)