---
title: <常用算法的C++实现>图论
date: 2019-3-22 16:26:51
tags: 算法学习
categories: C++
copyright: false
keywords: [C++,图论,算法]
description: 最短路径问题，最小生成树问题，最大匹配问题的基本算法学习。不定期更新。
---

# 最短路径问题

> 从文字上理解，就是求哪到哪儿的路径最短，题目会给多个点，点与点之间是否相连，权值是多少。一般来说需要我们计算一个节点到其他所有节点的最短路径。然后输出源点到某点的最短路径。

## Dijkstra算法

> 能解决的问题：无负边的单源最短路

> 在带权图 G = (V, E) 中，每条边都有一个权值w[i]。路径的长度为路径上所有边权之和。
>
> 求源点 s到图中其余各顶点的最短路径。

### 概述

> 解决单源最短路径问题常用 Dijkstra 算法，用于计算一个顶点到其他所有顶点的最短路径。Dijkstra 算法的主要特点是以起点为中心，逐层向外扩展，每次都会取一个最近点继续扩展，直到取完所有点为止。

### 算法流程

> 我们定义带权图 G所有顶点的集合为V，接着我们再定义已确定从源点出发的最短路径的顶点集合为 U，初始集合 U 为空，记从源点 s 出发到每个顶点 vv 的距离为 dist_v，初始 dist_s=0。接着执行以下操作：
> 1. 从 V-U 中找出一个距离源点最近的顶点 v，将 v 加入集合 U，并用 dist_v 和顶点 v 连出的边来更新和 v 相邻的、不在集合 U 中的顶点的 dist；
> 2. 重复第一步操作，直到 V=U或找不出一个从 s出发有路径到达的顶点，算法结束。
> 如果最后V≠U，说明有顶点无法从源点到达；否则每个 dist_i表示从 出发到顶点i 的最短距离。

### 算法优化

> Dijkstra最简单的版本就是使用一个数组当作上述的集合U，每一次遍历，找出目前最新且最短的边权，以它为新的源点，同时更新与它相关的最短路径的值。
>
> 我们可以使用一个优先队列去代替数组承担集合U，这样可以保证每次取出队列头部的边权当前最小的。省去了遍历和对比的时间。

#### 例子

![](http://wiki.mbalib.com/w/images/6/65/Dijkstra%E7%AE%97%E6%B3%95%E5%9B%BE.jpg)

> 如上图 ，源点为左上角，黄色点内的数字代表源点到他们的距离。初始值都是无穷大99。
>
> 先push源点，然后开始探索图，取得队列头，即源点，开始遍历，源点到右边的点边权为2，比之前的99要小，那么更新距离，同时把这个点push进去，同理对其他连接的两个点进行操作。更新后的最新距离分别为9和6，当前优先队列的值为：2,6,9。这个时候发现没有连接其他点了，结束当前循环。此时的图为第一行第二列。
>
> 因为是优先队列，我们取得的头部是源点距离为2的点，也是除了源点到自身以外当前最短的点。同样进行上述操作。
>
> 因为每一次循环，已经确定过最短路径的点不会再被push到优先队列中，所以在优先队列为空的时候，我们已经获得了源点到各点的最短距离。
>
> 如果发现到某点的最短距离为99(无穷大)，说明无法到达这个点。

#### 代码

```C++
const int maxn=1e4+1;
//存储from点,to点,和权值
//pair是std中的一种数据结构，存储两个数据，分别用first、second取得。
//可以用结构体代替
vector<pair<int,int> >Edge[maxn];
//存储路径长度。
int s[maxn];
//根据节点数初始化。
void init(int n)
{
    for(int i=0;i<=n;i++)
    {
        Edge[i].clear();
        //因为求的是最小，所以初始值应该是无穷大，方便对比
        s[i]=1e9;
    }
}
void dijkstraByQueue()
{
    //点数目，边数目，源点
    int n,e,sourse;
    cin>>n>>e>>sourse;
    //初始化
    init(n);
    //from,to,worth
    int x,y,w;
    for(int i=0;i<e;i++)
    {
        cin>>x>>y>>w;
        //x->y=w
        Edge[x].push_back(make_pair(y,w));
        //如果是无向图，那么反过来添加一次。
        //Edge[y].push_back(make_pair(x,w));
    }
    //源点到自身的路径肯定为0
    s[sourse]=0;
    //优先队列 ，存储边权，目标点(to)，优先队列会默认按照边权从大到小排序
    priority_queue<pair<int,int>> Q;
    //把源点到自身的距离(0)，以及自己的节点push到优先队列中
    Q.push(make_pair(0,sourse));
    //开始探索地图
    while(!Q.empty())
    {
        //获取当前相对最新点，然后从优先队列中弹出
        int cur=Q.top().second; Q.pop();
        //遍历当前点所连接的点(to)，判断他们之间的边权
        for(int i=0;i<Edge[cur].size();i++)
        {
            //取得点
            int target=Edge[cur][i].first;
            //判断当前记录的 源点到目标点的距离s[target] 和当前最新点与目标点的距离Edge[cur][i].second+s[cur]长度关系
            if(s[target]>Edge[cur][i].second+s[cur])
            {
                //如果发现当前记录并不是最短距离，那么就更新它
                s[target]=Edge[cur][i].second+s[cur];
                //把到达这个点的边权和点下标push到优先队列中，因为优先队列默认是按大到小排序，我们的需求是小到大，所以推入-1*边权就可以了。
                //如果使用自定义的结构体，可以另写一个cmp。
                Q.push(make_pair(-1*s[target],target));
            }
        }
    }
    //当上面的队列为空的时候，说明我们以及探索完整个图了，此时我们的s[]储存的就是源点到其他点的最短距离了。
    for(int i=1;i<=n;i++)
        cout<<s[i]<<endl;
}
```

---

## SPFA算法

> 能解决的问题：有负边的单源最短路

### 概述

> 其实 SPFA 本质是 Bellman-ford 算法的队列优化。由国内段凡丁教授发表，大家可以自行百度查阅相关信息。
>
> 如果没有负权边的情况下还是使用堆/优先队列优化的dijkstra吧。

### 算法流程

> 在 SPFA 算法中，使用 d_i表示从源点到顶点 i 的最短路，额外用一个队列来保存即将进行拓展的顶点列表，并用 inq_i 来标识顶点 i是不是在队列中。
>
> 1. 初始队列中仅包含源点，且源点 s 的 d_s=0。
> 2. 取出队列头顶点 u，扫描从顶点 u 出发的每条边，设每条边的另一端为 v，边 <u,v> 权值为 w，若 d_u+w<d_v，则
> - 将 d_v修改为 d_u+w
> - 若 vv不在队列中，则将 v入队
> 1. 重复步骤 2 直到队列为空
> 最终 dd数组就是从源点出发到每个顶点的最短路距离。如果一个顶点从没有入队，则说明没有从源点到该顶点的路径。

### 负环判断

> 在进行 SPFA 时，用一个数组 cnt_i 来标记每个顶点入队次数。如果一个顶点入队次数 cnt_i大于顶点总数 n，则表示该图中包含负环。

### 代码

> 在这里贴下最简单的spfa实现，至于lll和slf优化在日后了解后再更新。

```C++
vector<pair<int,int> >Edge[maxn];
//多出的inQueue是为了判断某点是否在队列中。
int s[maxn],inQueue[maxn];
//初始化
void init(int n)
{
    for(int i=0;i<=n;i++)
    {
        Edge[i].clear();
        s[i]=1e9;
        inQueue[i]=0;
    }
}

void spfa()
{
    int n,e,source;
    int x,y,w;
    //记录被推入队列的次数，如果超过点数目n，说明有负环。
    int pushCount[maxn];
    cin>>n>>e>>source;
    init(n);
    for(int i=0;i<e;i++)
    {
        cin>>x>>y>>w;
        Edge[x].push_back(make_pair(y,w));
        //初始化推入次数为0
        pushCount[x]=0;
    }
    //在这里使用的是队列不是优先队列，lll和slf优化可以使用deque
    queue<int> Q;
    //到自身距离为0
    s[source]=0;
    //推入次数更新
    pushCount[source]=1;
    //推入
    Q.push(source);
    //开始探索
    while(!Q.empty())
    {
        //取队头
        int cur=Q.front();
        Q.pop();
        //此时队头对应的点已经不在队列里了。
        inQueue[cur]=0;
        //和上面的dijkstra算法一样进行松弛处理
        for(int i=0;i<Edge[cur].size();i++)
        {
            int target=Edge[cur][i].first;
            if(s[target]>Edge[cur][i].second+s[cur])
            {
                //更新最短路径
                s[target]=Edge[cur][i].second+s[cur];
                //如果这个点依然在队列里，那么就不需要推入
                if(inQueue[target])
                    continue;
               //如果推入此时大于点的数目n，说明有负环
                if(++pushCount[target]>=n)
                {
                                     cout<<"-1"<<endl;
                                     return;
                }
                //再此将它推入
                inQueue[target]=1;
                Q.push(target);
            }
        }
    }
    //输出最短距离
    for(int i=0;i<n;i++)
        cout<<s[i]<<endl;

}
```



## Floyd算法

> 能解决的问题：多源点最短路径
>
> 时间复杂度很高，毕竟要求出所有点到其他点的最短距离。

### 概述

> Floyd 算法是一种利用动态规划的思想、计算给定的带权图中任意两个顶点之间最短路径的算法。相比于重复执行多次单源最短路算法，Floyd 具有高效、代码简短的优势，在解决图论最短路题目时比较常用。

### 算法流程

> Floyd 的基本思想是：对于一个顶点个数为 n 的有向图，并有一个n×n 的E\[\]\[\]，其中矩阵横列下标相等，代表自身到自身，对应的值应为0
> 对于其余任意两个顶点 i,j若它们之间存在有向边，则以此边权上的权值作为E\[i\]\[j\]=w；
> 若两个顶点i,j 之间不存在有向边，则E\[i\]\[j\]=INF。
> 对于循环阶段 ，尝试增加一个中继点 k，如果通过中间顶点使得最短路径变短了，就更新结果。
> 累加 k，重复遍历所有可能成为中继的点下标，直到 k=n。
> 算法结束后，矩阵 E\[\]\[\]中的元素就代表着图中任意两点之间的最短路径长度。

### 代码

```C++
const int inf = 0x3f3f3f3f;
const int maxn=1e4+1;
//用矩阵存储距离
int g[maxn][maxn]; 

// 初始化
void init() {
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i == j) {
                //到自身的距离为0
                g[i][j] = 0;
            } else {
                //初始化为无穷大
                g[i][j] = inf;
            }
        }
    }
}
void floyd() {
    int n,e;
    int x,y,w;
    cin>>n>>e;
    for(int i=0;i<e;i++)
    {
        cin>>x>>y>>w;
        //x到y的边权为w
        g[x][y]=w;
    }
    //三重循环，分别代表中继点k、当前点i(from)，目标点j(to)
    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                //如果i到k+k到j的距离比原来i直接到j的距离还短，就更新
                if (g[i][k] + g[k][j] < g[i][j]) {
                    g[i][j] = g[i][k] + g[k][j];
                }
            }
        }
    }
}
```







# 最小生成树问题

> 一个有 n 个结点的[连通图](https://baike.baidu.com/item/%E8%BF%9E%E9%80%9A%E5%9B%BE/6460995)的生成树是原图的极小连通子图，且包含原图中的所有 n 个结点，并且有保持图连通的最少的边。
>
> 一般常见题目是求道路如何建设，使得各个位置能够互通，并且花费最少。

## prim算法

### 概述

> Prim算法求最小生成树的时候和边数无关，和顶点数有关，所以适合求解稠密网的最小生成树。
>
> 每一次从已经纳入最小生成树的点出发，找到所连接的未纳入的最短边权点，将其纳入生成树中，直到遍历所有点。

### 算法流程

> 1. 将一个图分为两部分，一部分归为点集U，一部分归为点集V，U的初始集合为{V1}，V的初始集合为{ALL-V1}。
>
> 2. 针对U开始找U中各节点的所有关联的边的权值最小的那个，然后将关联的节点Vi加入到U中，并且从V中删除（注意不能形成环）。
>
> 3. 递归执行步骤2，直到V中的集合为空。
>
> 4. U中所有节点构成的树就是最小生成树。

### 例子

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553341419376&di=6ec4836b72efa5b6776dbb8bd54b0e37&imgtype=0&src=http%3A%2F%2Fpic002.cnblogs.com%2Fimages%2F2011%2F282432%2F2011052215540276.jpg)

> 如上图，我们以点为单位，从V1点出发，找到它连接的点V2、V3、V4，其中最短边权为V1->V3=1，所以我们将V3纳入最小生成树(算法流程所述的集合U)，此时U为{V1、V3}。
>
> 然后从V1、V3这个最小生成树所连接的点继续寻找，找到V3->V6的边权最小，为4，那么纳入最小生成树，继续以上操作，直到遍历完毕。
>
> 如果遍历结束后，发现有些点没被访问，就说明无法构成生成树。

### 代码

```c++
const int maxn = 4e+1;
//和前面的算法一样使用vector<pair<int,int> >
//pair存储to,value
//G[i]的i代表from
vector<pair<int,int> >G[maxn];
int vis[maxn];

void  Prim()
{
	int n,e,x,y,z;
    //最小生成树的权值
	int res=0;
    //输入点、边的数目
	cin>>n>>e;
	for(int i=0;i<e;i++)
	{
		cin>>x>>y>>z;
        //一般都是求无向图的最小生成树，有向图可以使用最小树形图。
        //-1*z 是因为优先队列默认从大到小，我们需要从小到大，随意推入取负的值。
        //自己实现结构体可以自己另写cmp
		G[x].push_back(make_pair(y,-1*z));
		G[y].push_back(make_pair(x,-1*z));
	}
    //从第一个点开始，下标为0，或者定义为1，后面也要从1开始。
	vis[0]=1;
	priority_queue<pair<int,int> > Q;
    
	for(int i=0;i<G[0].size();i++)
	{
        //遍历连接到的点，推入优先队列中，会自动按边权值排序。
		Q.push(G[0][i]);
	}
    //开始探索
	while(!Q.empty())
	{
        //取得队头的点的连接目标点to和权值value
		int to=Q.top().first;
		int value=Q.top().second;
        ///弹出
		Q.pop();
        //如果已经访问过，也就是说，已经在当前的生成树中/集合U中
		if(vis[to])
		continue;
        //否则标记以访问/纳入
		vis[to]=1;
        //加入最小生成树的权值，因为之前我们把每条边的权值当作负数推入，这里减到而不是加上，--得+
		res-=value;
        //遍历当前点可以到达的所有点，推入优先队列。
		for(int i=0;i<G[to].size();i++)
		{
		Q.push(G[to][i]);
		}
	}
    //如果有点没访问，说明无法构成最小生成树
	for(int i=0;i<n;i++)
		if(vis[i]==0)
			{
				cout<<-1<<endl;
				return;
			}
    //输出花费
	cout<<res<<endl;

}
```

## Kruskal算法

### 概述

> 与prim相反，kruskal算法的注重点是边而不是点，它每次取图中相对权值最小的边，然后将边的两端点纳入集合中。而它基于并查集的思想。（[什么是并查集](https://blog.csdn.net/qq_41593380/article/details/81146850))

### 算法流程

> 创建一个数组，为每个节点存储自身的父节点，初始化为自身。也就是刚开始，每个人只指向自己。
>
> 我们将边权按从小到大的顺序，排序好边权和对应的两端点。
>
> 我们取当前最小边权，把其两端点合并，也就是让他们的存储父节点的数组对应的值指向同一个节点，换句话说，这就是一个两个点组合成的子树了。
>
> 一直到所有点都纳入那个子树。
>
> 注意的是，合并两个点时，不是简单的赋值点下标，而是应该找到点的最终父节点，再把其赋值给另一端点的数组索引中。

### 例子

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553341419376&di=6ec4836b72efa5b6776dbb8bd54b0e37&imgtype=0&src=http%3A%2F%2Fpic002.cnblogs.com%2Fimages%2F2011%2F282432%2F2011052215540276.jpg)

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553344343733&di=3c4090aa5fbe76c7819d0577bcc38f64&imgtype=0&src=http%3A%2F%2Fwww.xdwy.com.cn%2FDOWN%2Fcourse%2Fsffxysj%2Fmnst%2Fmnst1.files%2Fimage011.gif)



> 下图是kruskal算法，因为和prim算法用的是同一个原图，所以一起展示。
>
> 将边权排序得：1->2->3->4->5->5->5->6->6
>
> 这里采用按秩合并。
>
> 我们取1，它的两端点是V1、V3 ，将他们合并 {V1,V3}，他们此时记录父节点的数组f[V1]=f[V3]=V1;
>
> 同理取2，它的两端点是V4、V6， 将他们合并{V4，V6},他们此时记录父节点的数组f[V4]=f[V6]=V4;
>
> 同理取3，它的两端点是V2、V5， 将他们合并{V2，V5},他们此时记录父节点的数组f[V2]=f[V5]=V2;
>
> 同理取4，它的两端点是V3、V6， 将他们合并{V3，V6},注意，这时候，V3的父节点即f[V3]的值为V1，而V6的父节点即f[V6]的值为V4，将其赋值，得f[V3]=f[V4]=V1,而V6的父节点依然为V4，但是V6的祖父节点f[V4]是V1了。合并的集合也成{V1、V3 、V6、V4}
>
> 此时树为：V1->V3
>
> ​			\\->V4->V6
>
> 同理取5，把端点V3的祖父节点赋值给另一个断点的祖父节点f[V2]，最后得树：
>
> V1->V3->V2->V5
>
> ​     \\->V4->V6

### 代码

```C++
const int maxn=1e5+1;
//记录父亲节点
int father[maxn];
//因为我们需要对边权排序，并且需要获得两端点的下标，那么之前的vector<pair<,>> 在这里就用处不大了。
struct Edge{
    int from, to;
    long long value;
    //重写操作符，让它进入优先队列时自动按从小到大排序
    friend bool operator <(const Edge x,const Edge y)
    {
        return x.value>y.value;
    }
};

void init(int n)
{
    for(int i=0;i<=n;i++)
    {
    //初始化，让所有点的父节点为自身
        father[i]=i;
    }
}
//查找组父节点
int findRoot(int target)
{
//如果父节点是自身，说明已经到头了，也就是找到祖父了。
    return father[target]==target ?target:findRoot(father[target]);
}
//判断两个点x和y是不是指向同一个父亲节点，也就是是否在同一个集合中
bool isUnion(int x,int y)
{

    return findRoot(x)==findRoot(y);
}
//整合
void comeTogeter(int x,int y)
{
    if(isUnion(x,y)) return ;
    //把x的祖父节点的父节点设置为y的祖父节点。
    father[findRoot(x)]=findRoot(y);
}

void kruskal()
{
	//点、边
    int n,e;
	//to from worth
    int x,y,w;
    //花费
    int res=0;
    //临时Edge对象
    cin>>n>>e;
    //初始化
    init(n);
    priority_queue<Edge> Q;
    for(int i=0;i<e;i++)
    {
        cin>>x>>y>>w;
        Edge temp;
        temp.from=x;
        temp.to=y;
        temp.value=w;
        Q.push(temp);
    }
    Edge temp;
    while(!Q.empty())
    {
    	//取队列头，C++提供浅拷贝，直接赋值就好了
        temp=Q.top();
        Q.pop();
        //判断是否在同个集合里，如果在就跳过
        if(isUnion(temp.from,temp.to))
            continue;
         //不在，那么整合
        comeTogeter(temp.from,temp.to);
        //加入边权
        res+=temp.value;
    }
    
    //判断是不是所有点都在一个集合/生成树中
    for(int i=1;i<n;i++)
        if(!isUnion(0,i))
    {
        res=-1;
        break;
    }
    cout<<res<<endl;
}
```

---

# 最大匹配问题

> 把所有点分成两个左右集合，左右集合里的点可以与对面集合的多个点有边，但不与同集合的点有边。
>
> 那么一般会问你求最大匹配和完美匹配。
>
> 
>
> 什么是最大匹配？
>
> ​	上面谈到一个点可以与对面多个点有边，所以有可能出现左集合中的两点与对面集合的某点都有一条边，那么怎么分配，才能尽量让左右集合里的点一一对应且不重复呢。
>
> ​	网上很多都是拿男女生牵手的例子，每个男生都对自己心仪的女生们发出牵手请求，如何安排使得尽量满足每个男生都能牵到心仪女生的手，并且不会出现两个男生抢一个女生的 情况。求能牵手成功的最大数量，就是最大匹配。
>
> ​		
>
> 什么时完美匹配？
>
> ​	基于最大匹配，左右集合的所有点都与对面集合有且只有一条边。
>
> ​	如图Fig.4 ，1-7；2-5；3-6‘4-8；一一对应且不占用同个右边的点。

![](https://img.renfei.org/2013/08/2.png)

![Maximum Matching](https://img.renfei.org/2013/08/4.png)

## 匈牙利算法

### 概述

> 发现概述不起来，直接看算法流程吧0 0

### 算法流程

> 假设有集合UX、UY，其中UX有多个点连接UY中的n个点，n>=1
>
> 从UX的点xi开始遍历，找到它连接的第一个对面点yj，如果这个对面点yj没有被连接，那么我们将该点xi和对面点yi连接。
>
> 如果对面点yj被连接了，这时候并不是直接放弃，我们获取对面点yj所连接的点xk,这时候我们对xk进行上述操作，也就是说，我们要找到xk能连接的下一个对面点(抛开yj)
>
> ​	1.如果找不到，说明xk只能连接yj，那么xi只能找它的下一个可连接点。
>
> ​	2.如果找得到，那么让xk放弃yj，连接其他的点，让xi与yj连接。
>
> OK，这就是主要流程，我们对所有UX中的点按顺序进行上述操作，直到最后一个点，我们就可以找出最大匹配的数量了。

### 代码

```C++
//邻接矩阵 值为1 代表i和j可以连接
int e[maxn][maxn];
//记录当前X集合和Y集合里某点连接的点下标
int fromX[maxn],fromY[maxn];
//是否访问过
int vis[maxn];
//X集合的数目和Y的
int nX,nY;

//尝试搜寻连接 
//x：尝试连接的点下标
bool line(int x)
{
    //从1到nY遍历，也可以从0到ny-1，看输入情况
    for(int y=1;y<=nY;y++)
    {
        //如果他们可以连接 并且 Y集合的y点没有被访问过(被连接过)
        if(e[x][y]&&!vis[y])
        {
            //访问y
            vis[y]=1;
            //如果y连接的点=-1，-1代表还没和任何点连接
            //或者连接了某点 调用line为这个点递归查找是否可以连接其他点
            if(fromY[y]==-1||line(fromY[y]))
            {
                //让x和y连接，并在fromX/Y中登记连接对象的下标
                fromX[x]=y;
                fromY[y]=x;
                //返回可以连接
                //注意 如果这个点y是第一次被访问，此时返回true代表它第一次被连接
                //如果是被递归调用，则代表它以被允许连接的下一个点连接
                return true;
            }
        }
    }
    //返回不可以连接||不可以被下一个点连接
    return false;
}
//最大匹配
int maxMatch()
{
    //连接数n x集合数 y集合数
    int n,x,y;
    //最大匹配的数值
    int sum=0;
    memset(fromX,-1,sizeof(fromX));
    memset(fromY,-1,sizeof(fromY));
    memset(e,0,sizeof(e));
    cin>>n;
    cin>>nX>>xY;
    for(int i=0;i<n;i++)
    {
        cin>>x>>y;
        //可以连接 为1
        e[x][y]=1;
    }
    for(int i=1;i<=nX;i++)
    {
        //如果x集合中的i还没有和对面连接
        if(fromX[i]==-1)
        {
            //格式化访问数组vis 这个是精髓 因为每一次调用line，都可能造成第一次连接的那个点的重新连接，所以vis数组是要被格式化的。
            memset(vis,0,sizeof(vis));
            //如果可以连接 那么数目加1
            if(line(i)) sum++;;
        }
    }
    //如果sum=nX||sum=nY  （看题目要求，以X集合为主还是Y集合为主）
    //如果X/Y集合的所有点都成功连接了唯一的对面集合的点 那么就是完美匹配~
    cout<<sum<<endl;
}
```



## 参考文章

[最小生成树Prim算法和Kruskal算法]: https://www.cnblogs.com/JoshuaMK/p/prim_kruskal.html
[最短路知识点总结]: https://blog.csdn.net/qq_38944163/article/details/79678098
[趣写算法系列之--匈牙利算法]: https://blog.csdn.net/dark_scope/article/details/8880547
[UESTCACM 每周算法讲堂 Kruskal和Prim算法求最小生成树]: https://www.bilibili.com/video/av4768483/?p=2
[UESTCACM 每周算法讲堂 SPFA与迪杰斯特拉算法]: https://www.bilibili.com/video/av4224493?from=search&amp;seid=14605237986691620414

