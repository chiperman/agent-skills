---
name: longbridge-invest-analysis-us
description: '自动化获取长桥美股投资周报数据并生成深度分析报告。V2 版本支持 QQQ/VOO 标杆对比、MA/EMA 技术指标、财务指数及资金流向分析。专注于多维市场分析和专业视觉呈现。'
---

# Longbridge Weekly Investment Analysis

本技能旨在自动化获取用户在长桥证券（Longbridge）的多维投资数据，并生成集成专业 K 线图表和深度量化分析的 Markdown 与 HTML 报告。

## 核心流程

1. **获取数据**:
   - 运行脚本 `scripts/fetch_weekly_data.py`。
   - **必选数据**:
     - `portfolio.json`: 持仓及资产。
     - `orders.json`: 本周交易记录。
     - `market_temp.json`: 市场情绪。
     - `benchmarks/`: 抓取 QQQ.US 和 VOO.US 的 K 线数据作为基准。
     - `kline/`: 抓取持仓标的过去 200 天的日 K 线，用于计算均线。
     - `metrics/`: 抓取 `calc-index` (PE/PB/换手率) 和 `capital --flow` (资金流向)。

2. **量化分析**:
   - **技术面**: 计算 MA(5, 20, 120, 200) 和 EMA 指标。
   - **表现面**: 计算组合 vs QQQ/VOO 的超额收益 (Alpha)。
   - **资金面**: 汇总本周大单/净流入趋势。
   - **风险面**: 评估个股相对于均线的偏离度。

3. **生成结果**:
   - 生成结构化的 `weekly_report_<DATE>.md`。
   - 使用 `assets/report_template.html` 渲染生成 HTML，必须集成 **Lightweight Charts** 展示动态 K 线和均线。

## 报告结构要求

### 1. 资产与基准对比

- 总资产、周盈亏、风险等级。
- **组合收益 vs QQQ vs VOO** 的对比曲线或表格。

### 2. 核心持仓技术分析 (带图表)

- 每个核心持仓必须配备 **Lightweight Charts** K 线图。
- 图表包含：K 线、MA(5, 20, 120, 200)、本周买卖点标记。
- 财务指标：PE、PB、本周资金净流入。

### 3. AI 策略深度反思

- 基于标杆对比的超额表现分析。
- 基于技术指标的支撑/压力位评估。
- 下周操作建议与对冲策略。

## 约束

- 始终优先使用本地脚本并保持 JSON 数据落地。
- 图表必须支持交互，视觉追求极致的 Premium 感。
- 严禁臆造数据，若 API 缺失需注明。
