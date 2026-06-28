# 洛书时机仪 Luoshu Timing Lab

**洛书时机仪**是一个东方时空哲学实验工具。它不是传统术数复刻，也不是确定性预测系统，而是一套基于洛书九宫、阴阳五行、现代时间编码与行动场景映射的可解释时机观察框架。

当前在线版本：  
https://spotpan.github.io/luoshu-timing-lab/

当前版本：`v0.2++ public beta invest-specific`

---

## 一、项目定位

洛书时机仪试图回答一个朴素问题：

> 同一件事，在不同时间、不同地点、不同问题结构下，是否会呈现出不同的行动窗口？

传统术数中有大量关于“时、空、人、事、势”的观察方法，但许多规则复杂、解释不透明，也难以适配现代问题。洛书时机仪并不试图原样复刻传统体系，而是以洛书、阴阳、五行和三界结构为启发，重新构造一个面向现代场景的时机分析工具。

本工具的核心目标不是“断命”，而是：

- 比较两个时间窗口；
- 拆解当前主势、阻力与行动倾向；
- 将抽象的时空结构转译为可理解的行动建议；
- 通过案例复盘持续校准规则体系。

一句话概括：

> 不是问命，而是看势。

---

## 二、设计理念

洛书时机仪的底层设计采用“三界时空模型”。

### 1. 先天：定时

先天层负责接收现代公历时间输入，包括年、月、日、时。系统将连续时间编码为十态阴阳五行结构，形成最初的时间状态。

### 2. 中天：成场

中天层对应洛书九宫。时间状态进入九宫后，会经过阴阳调和、五行生克、空间传播与中宫平衡，形成一个当前时刻的“九宫场”。

洛书九宫在本系统中不是装饰图案，而是一个用于表达结构关系的空间滤波器。

### 3. 后天：取用

后天层根据用户选择的问题类型，对九宫场进行现代语义解释。不同问题会触发不同的问事映射，例如签约、项目、商业、天气、地点、感情、投资等。

因此，同一个时间场在不同问题中会被转译为不同的行动译文。

---

## 三、核心原则

本项目遵循以下原则：

1. **不是确定性预测**  
   系统输出的是行动倾向与结构观察，不是对未来结果的绝对断言。

2. **不是传统术数复刻**  
   本项目借鉴洛书、阴阳、五行等东方数理思想，但规则体系属于现代重构。

3. **不是专业建议替代品**  
   天气、投资、医疗、法律等问题必须以专业信息和现实判断为准。

4. **强调可解释**  
   系统尽量展示主势、次势、弱项、九宫结构、行动理由与场景映射。

5. **强调可复盘**  
   用户可以保存本地案例，观察系统建议与实际结果之间的关系。

---

## 四、主要功能

### 1. 一句话问题

用户可以输入一个自然语言问题，例如：

- 今天适合观察新能源板块的买入窗口吗？
- 今天上午适合谈合作吗？
- 下午适合发布项目进展吗？
- 今天适合看某个地点吗？
- 现在适合主动联系某人吗？

### 2. A/B 时机比较

用户可以输入两个时刻，系统会分别生成两个时刻的九宫场，并给出差异比较。

适合用于：

- 上午 vs 下午；
- 今天 vs 明天；
- 现在行动 vs 延后行动；
- A 时间见面 vs B 时间见面；
- A 时间买入观察 vs B 时间买入观察。

### 3. 九宫灵象展示

系统使用九宫灵象表达九宫状态：

| 宫名 | 象意 |
|---|---|
| 玄裁宫 | 隐性规则、审查、边界、暗线压力 |
| 天衡宫 | 显性规则、合同、秩序、决断 |
| 烛影宫 | 暗光、内燃、暧昧、微热 |
| 生枝宫 | 生发、推进、主动、突破 |
| 中枢宫 | 承载、调度、守恒、现实结构 |
| 曜焰宫 | 表达、显化、热度、发布 |
| 藏根宫 | 根基、酝酿、内生、关系底层 |
| 启流宫 | 沟通、信息、连接、开始流动 |
| 藏渊宫 | 情绪、沉潜、缓冲、隐性流动 |

### 4. 行动译文

系统会根据不同问题生成对应的行动语言。例如：

- 签约类：条款、边界、责任、审查；
- 项目类：发布、汇报、推进、等待；
- 商业类：启动、客流、现金流、成本；
- 地点类：承载、稳定、流动、阻滞；
- 感情类：沟通、见面、试探、现实压力；
- 天气类：水汽、晴热、阻滞、稳定；
- 投资类：行业轮动、买入观察、卖出观察、持有观察。

---

## 五、投资 / 行业模块说明

投资模块是当前版本的重要增强功能。它将行业方向映射到五行结构中，用于观察不同时间窗口下的行业轮动倾向。

### 行业五行映射

| 五行 | 细分方向 |
|---|---|
| 木 | 医药生物、中药/创新药、教育服务、农业种业、成长消费、环保林业 |
| 火 | AI 应用、传媒游戏、互联网平台、算力/数据中心、光伏/储能、新能源车链 |
| 土 | 地产链、基建建材、水泥工程、煤炭资源、公用事业、高股息红利 |
| 金 | 银行、券商、保险、高端制造、机器人/自动化、半导体设备、芯片硬件、军工装备、黄金/贵金属 |
| 水 | 物流快递、航运港口、跨境贸易、旅游出行、电商流通、数据流/支付流 |

### 投资模块可观察的问题

- 当前更适合观察哪个行业方向？
- 今天更偏买入观察还是卖出观察？
- 哪些方向适合持有观察？
- 哪些高热度题材需要止盈检查？
- 哪些低位方向可能出现轮动？
- 不同时段的行业倾向是否不同？

### 投资模块边界

本工具不提供证券投资建议，不推荐具体股票，不构成买卖依据。投资模块仅用于行业五行与时机节奏观察。真实投资决策仍需结合基本面、价格趋势、成交量、仓位管理、风险偏好和专业判断。

---

## 六、使用方法

1. 打开在线页面：  
   https://spotpan.github.io/luoshu-timing-lab/

2. 输入一句话问题。  
   例如：  
   `今天适合观察新能源板块的买入窗口吗？`

3. 选择一级问事类型。  
   例如：  
   `投资/行业`

4. 选择二级场景。  
   例如：  
   `买入观察：成长/弹性方向`

5. 设置时刻 A 和时刻 B。  
   可以比较上午与下午，也可以比较今天与明天。

6. 选择地点或输入纬度。  
   当前版本采用当地时间与纬度弱调制，不引入星座或传统神煞。

7. 点击分析，查看：
   - 当前主势；
   - 行动译文；
   - A/B 差异；
   - 九宫灵象；
   - 专业盘；
   - 案例复盘记录。

---

## 七、本地案例与反馈

当前版本支持本地案例保存。案例只保存在当前浏览器中，不会自动上传，也不会被其他人看到。

用户可以：

- 保存本次案例；
- 查看本地案例；
- 导出本地案例；
- 提交复盘反馈。

提交反馈前，请自行删除姓名、联系方式、住址、具体账户、资金规模等个人隐私信息。

---

## 八、版本状态

当前版本仍处于 public beta 阶段。

目前已经支持：

- 三界主视觉；
- A/B 时机比较；
- 九宫灵象；
- 行动译文；
- 方法说明；
- 案例复盘；
- 天气象意模块；
- 投资行业细分模块；
- 本地案例保存与导出；
- 复盘反馈入口。

暂未引入：

- 星座外盘；
- 十六宫扩展；
- 传统神煞系统；
- 用户账户系统；
- 公共案例墙；
- 后端数据库；
- 实时市场数据；
- 实时天气数据。

---

## 九、免责声明

洛书时机仪是一个东方时空哲学实验工具。系统输出内容仅供行动倾向观察、个人思考与案例复盘使用，不构成确定性预测，也不构成天气、投资、医疗、法律、心理咨询等专业建议。

对于投资类问题，本工具不提供个股推荐，不构成买入、卖出或持有建议。用户应结合自身风险承受能力、专业信息和独立判断进行决策。

对于天气类问题，本工具不替代真实天气预报、雷达回波、气象部门预警或专业气象服务。

---

## 十、项目愿景

洛书时机仪的长期目标不是制造一个神秘化工具，而是探索一种新的东方时空解释框架：

> 将时间、地点、主体和问题结构放入同一个可解释场中，观察行动窗口的变化。

它试图在传统象数思想与现代交互产品之间建立一座桥梁，使古老的“观时、观势、观变”思想能够以更清晰、更透明、更可复盘的方式被重新理解。

---

## 仓库简介建议

洛书时机仪：一个东方时空哲学实验工具，用于比较行动窗口、观察行业轮动与记录案例复盘。

---

# English Version

# Luoshu Timing Lab

**Luoshu Timing Lab** is an experimental tool inspired by Eastern temporal-spatial philosophy. It is not a replication of traditional divination systems, nor is it a deterministic prediction engine. Instead, it is a modern interpretive framework based on the Luoshu nine-grid structure, yin-yang and five-element symbolism, contemporary time encoding, and scenario-based action mapping.

Live demo:  
https://spotpan.github.io/luoshu-timing-lab/en

Current version: `v0.2++ public beta invest-specific`

---

## 1. Project Positioning

Luoshu Timing Lab explores a simple question:

> Can the same action present different structural tendencies under different times, places, and problem contexts?

Traditional Chinese symbolic systems contain many ways of observing time, space, human intention, events, and situational momentum. However, many traditional rules are complex, opaque, and difficult to adapt to modern use cases. Luoshu Timing Lab does not attempt to reproduce those systems directly. Instead, it uses Luoshu, yin-yang, the five elements, and a three-layer temporal-spatial structure as inspiration to build a modern timing-analysis interface.

The goal is not to “tell fate,” but to:

- compare two possible time windows;
- identify the dominant force, resistance, and action tendency;
- translate abstract temporal-spatial structure into understandable action language;
- support case-based review and iterative refinement.

In one sentence:

> It is not about asking fate. It is about observing momentum.

---

## 2. Design Philosophy

Luoshu Timing Lab is built around a three-layer temporal-spatial model.

### 2.1 Pre-Form Layer: Time Encoding

The first layer receives modern calendar time, including year, month, day, and hour. The system converts continuous time into a ten-state yin-yang and five-element representation, which forms the initial temporal state.

### 2.2 Middle Layer: Field Formation

The middle layer corresponds to the Luoshu nine-grid field. After entering the nine-grid structure, the time state is processed through yin-yang balancing, five-element interaction, spatial propagation, and central-field adjustment.

In this system, the Luoshu grid is not a decorative diagram. It functions as a symbolic spatial filter for expressing structural relationships.

### 2.3 Applied Layer: Scenario Interpretation

The applied layer translates the nine-grid field according to the user’s selected scenario. Different scenarios activate different interpretive heads, such as contracts, projects, business, weather, location, relationship, and investment.

Therefore, the same temporal field may produce different action language depending on the question being asked.

---

## 3. Core Principles

This project follows several principles:

1. **Not deterministic prediction**  
   The output is an observation of tendency and structure, not an absolute statement about the future.

2. **Not a direct copy of traditional systems**  
   The project is inspired by Luoshu, yin-yang, and five-element thought, but its rule system is a modern reconstruction.

3. **Not a replacement for professional advice**  
   Weather, investment, medical, legal, and other professional matters must rely on real data, domain expertise, and independent judgment.

4. **Explainability matters**  
   The interface aims to show dominant force, secondary force, weak point, nine-grid structure, interpretive reasoning, and scenario mapping.

5. **Reviewability matters**  
   Users may save local cases and later compare the system’s interpretation with real outcomes.

---

## 4. Main Features

### 4.1 One-Sentence Question

Users can enter a natural-language question, such as:

- Is today a suitable window to observe the new-energy sector?
- Is this morning suitable for discussing a collaboration?
- Is this afternoon suitable for publishing a project update?
- Is today suitable for visiting a location?
- Is now a suitable time to contact someone?

### 4.2 A/B Timing Comparison

Users can enter two time windows. The system generates a nine-grid field for each time and compares their differences.

This is useful for comparing:

- morning vs afternoon;
- today vs tomorrow;
- acting now vs delaying;
- meeting at time A vs time B;
- observing a buy-in window at time A vs time B.

### 4.3 Nine-Grid Symbolic Field

The system uses an original nine-grid symbolic language:

| Palace | Meaning |
|---|---|
| Hidden Boundary Palace | hidden rules, review pressure, implicit boundaries |
| Balance Order Palace | explicit rules, contracts, order, decision |
| Inner Flame Palace | subtle heat, inner activation, ambiguous warmth |
| Growth Branch Palace | growth, initiative, outward push, breakthrough |
| Central Pivot Palace | carrying capacity, coordination, balance, structural reality |
| Radiant Flame Palace | expression, visibility, heat, publication |
| Root Reserve Palace | foundation, incubation, internal growth, underlying relationship |
| Flow Initiation Palace | communication, information, connection, initial flow |
| Deep Water Palace | emotion, depth, buffering, hidden flow |

### 4.4 Action Translation

The system generates scenario-specific action language. For example:

- Contract scenarios: terms, boundaries, responsibilities, review;
- Project scenarios: release, reporting, pushing forward, waiting;
- Business scenarios: launch, traffic, cash flow, cost;
- Location scenarios: carrying capacity, stability, flow, blockage;
- Relationship scenarios: communication, meeting, testing, real-world pressure;
- Weather scenarios: moisture, heat, obstruction, stability;
- Investment scenarios: sector rotation, buy-in observation, take-profit observation, holding observation.

---

## 5. Investment / Sector Module

The investment module is a major enhancement in the current version. It maps sector categories into the five-element structure and uses timing comparison to observe sector-rotation tendencies.

### 5.1 Sector-to-Element Mapping

| Element | Sector Directions |
|---|---|
| Wood | biotech, traditional Chinese medicine, innovative medicine, education services, agriculture and seed industry, growth consumption, environmental forestry |
| Fire | AI applications, media and gaming, internet platforms, computing power and data centers, photovoltaic and energy storage, new-energy vehicle supply chain |
| Earth | real-estate chain, infrastructure, building materials, cement and engineering, coal and resources, utilities, high-dividend assets |
| Metal | banks, securities, insurance, advanced manufacturing, robotics and automation, semiconductor equipment, chip hardware, defense equipment, gold and precious metals |
| Water | logistics and express delivery, shipping and ports, cross-border trade, tourism and travel, e-commerce circulation, data-flow and payment-flow platforms |

### 5.2 Questions the Investment Module Can Explore

- Which sector direction appears more active under the current time field?
- Is the current window more suitable for buy-in observation or take-profit review?
- Which directions are better suited for holding observation?
- Which high-heat themes may require take-profit checks?
- Which low-position sectors may deserve rotation attention?
- Do two different time windows imply different sector tendencies?

### 5.3 Investment Boundary

This tool does not provide securities investment advice, does not recommend individual stocks, and does not constitute a basis for buying or selling. The investment module is only for observing sector symbolism and timing rhythm. Real investment decisions should be based on fundamentals, price action, volume, position management, risk tolerance, and professional judgment.

---

## 6. How to Use

1. Open the live page:  
   https://spotpan.github.io/luoshu-timing-lab/en

2. Enter a one-sentence question.  
   Example:  
   `Is today a suitable window to observe the new-energy sector?`

3. Select a primary scenario.  
   Example:  
   `Investment / Sector`

4. Select a secondary scenario.  
   Example:  
   `Buy-in Observation: Growth / High-Beta Direction`

5. Set Time A and Time B.  
   You can compare morning vs afternoon, today vs tomorrow, or now vs later.

6. Select a location or enter latitude.  
   The current version uses local time and weak latitude adjustment. It does not use astrology, traditional stars, or classical auxiliary spirits.

7. Run the analysis and review:
   - dominant force;
   - action translation;
   - A/B difference;
   - nine-grid symbolic field;
   - professional panel;
   - local case record.

---

## 7. Local Cases and Feedback

The current version supports local case saving. Cases are stored only in the current browser. They are not automatically uploaded and cannot be seen by other users.

Users may:

- save the current case;
- view local cases;
- export local cases;
- submit review feedback.

Before submitting feedback, please remove personal information such as names, contact details, addresses, account information, and specific position sizes.

---

## 8. Version Status

The project is currently in public beta.

Currently supported:

- three-layer visual structure;
- A/B timing comparison;
- nine-grid symbolic field;
- action translation;
- method explanation;
- case review;
- weather-symbolism module;
- investment-sector module;
- local case saving and export;
- review-feedback entry.

Not yet included:

- astrology outer field;
- sixteen-palace extension;
- traditional auxiliary spirit system;
- user accounts;
- public case wall;
- backend database;
- real-time market data;
- real-time weather data.

---

## 9. Disclaimer

Luoshu Timing Lab is an experimental tool inspired by Eastern temporal-spatial philosophy. Its output is for action tendency observation, personal reflection, and case review only. It does not constitute deterministic prediction, nor does it replace professional advice in weather, investment, medical, legal, psychological, or other professional fields.

For investment-related questions, this tool does not provide individual stock recommendations and does not constitute buy, sell, or hold advice. Users should make decisions based on their own risk tolerance, professional information, and independent judgment.

For weather-related questions, this tool does not replace real weather forecasts, radar observations, meteorological warnings, or professional weather services.

---

## 10. Project Vision

The long-term goal of Luoshu Timing Lab is not to build a mysterious prediction tool, but to explore a new interpretive framework for Eastern temporal-spatial thinking:

> Place time, location, subject, and question structure into one explainable field, and observe how the action window changes.

The project aims to build a bridge between traditional symbolic thinking and modern interactive products, allowing the ancient practice of observing time, momentum, and transformation to be re-expressed in a clearer, more transparent, and more reviewable way.

---

## Suggested Repository Description

Luoshu Timing Lab: an experimental Eastern temporal-spatial tool for comparing action windows, observing sector rotation, and recording case reviews.
