export interface SeasonVo {
  /**
   * 赛季ID
   */
  id: number
  /**
   * 赛季名称
   */
  name: string
  /**
   * 赛季状态：PREPARING / PLAYING / FINISHED
   */
  status: 'PREPARING' | 'PLAYING' | 'FINISHED'
  /**
   * 初始资金（每位玩家加入时获得的起始资金）
   */
  initialFund: number
  /**
   * 当前交易日序号（从1开始，0表示尚未开始）
   */
  currentTradeDay: number
  /**
   * 总交易日天数
   */
  totalTradeDays: number
  /**
   * 历史行情是否已揭示
   */
  historyRevealed: boolean
  /**
   * 历史行情起始日期（仅在 historyRevealed=true 时有值），格式 YYYY-MM-DD
   */
  historyStartDate: string
  /**
   * 历史行情结束日期，格式 YYYY-MM-DD
   */
  historyEndDate: string
}

/**
 * 股票行情响应对象
 */
export interface QuoteVo {
  /**
   * 股票代码
   */
  stockCode: string
  /**
   * 股票名称
   */
  stockName: string
  /**
   * 开盘价
   */
  openPrice: number
  /**
   * 收盘价
   */
  closePrice: number
  /**
   * 最高价
   */
  highPrice: number
  /**
   * 最低价
   */
  lowPrice: number
  /**
   * 成交量
   */
  volume: number
  /**
   * 日涨跌幅
   */
  increaseRateDay: number
}

/**
 * 账户响应对象
 */
export interface AccountVo {
  /**
   * 账户ID
   */
  id: number
  /**
   * 玩家名称
   */
  playerName: string
  /**
   * 可用资金
   */
  availableFund: number
  /**
   * 总资产 = availableFund + ∑(position.quantity × closePrice)
   */
  totalAsset: number
  /**
   * 收益率 = (totalAsset - initialFund) / initialFund × 100
   */
  profitRate: number
  /**
   * 初始资金（从赛季配置获取）
   */
  initialFund: number
  /**
   * 持仓列表
   */
  positions: PositionVo[]
}

/**
 * 持仓响应对象
 */
export interface PositionVo {
  /**
   * 股票代码
   */
  stockCode: string
  /**
   * 股票名称
   */
  stockName: string
  /**
   * 持仓数量
   */
  quantity: number
  /**
   * 当前价格
   */
  currentPrice: number
  /**
   * 市值 = quantity × currentPrice
   */
  marketValue: number
  /**
   * 盈亏 = quantity × (currentPrice - avgBuyPrice)
   */
  profitLoss: number
}

/**
 * 排行榜响应对象
 */
export interface RankVo {
  /**
   * 排名
   */
  rank: number
  /**
   * 玩家名称
   */
  playerName: string
  /**
   * 总资产
   */
  totalAsset: number
  /**
   * 收益率
   */
  profitRate: number
  /**
   * 持仓股票种数
   */
  positionCount: number
  /**
   * 持仓股票名称列表
   */
  positionStockNames: string[]
}

/**
 * 收益曲线数据点
 */
export interface ProfitPointVo {
  /**
   * 交易日序号
   */
  tradeDay: number
  /**
   * 总资产
   */
  totalAsset: number
  /**
   * 收益率
   */
  profitRate: number
}

/**
 * 持仓分布响应对象
 */
export interface PositionDistributionVo {
  /**
   * 股票代码
   */
  stockCode: string
  /**
   * 股票名称
   */
  stockName: string
  /**
   * 持仓数量
   */
  quantity: number
  /**
   * 市值
   */
  marketValue: number
  /**
   * 占比（百分比）
   */
  proportion: number
}

/**
 * 交易记录响应对象
 */
export interface TradeRecordVo {
  /**
   * 记录ID
   */
  id: number
  /**
   * 股票代码
   */
  stockCode: string
  /**
   * 交易类型 BUY/SELL
   */
  tradeType: 'BUY' | 'SELL'
  /**
   * 数量
   */
  quantity: number
  /**
   * 价格
   */
  price: number
  /**
   * 金额
   */
  amount: number
  /**
   * 交易日
   */
  tradeDay: number
  /**
   * 创建时间，格式 YYYY-MM-DDTHH:mm:ss
   */
  createTime: string
}

/**
 * 股票走势图（含买卖标记）
 */
export interface StockChartVo {
  stockCode: string
  stockName: string
  /**
   * 该玩家在该股票上的累计投入（买入总金额 - 卖出回笼金额）
   */
  stockTotalInvest: number
  /**
   * 该玩家在该股票上的总收益
   */
  stockProfit: number
  /**
   * 该玩家在该股票上的收益率（%）
   */
  stockProfitRate: number
  /**
   * 价格走势：每个交易日的OHLCV数据
   */
  prices: PricePoint[]
  /**
   * 买卖标记点
   */
  trades: TradeMarker[]
}

/**
 * 走势图单日价格点（StockChartVo.prices 元素）
 */
export interface PricePoint {
  /**
   * 赛季内第几个交易日（从1开始）
   */
  tradeDay: number
  openPrice: number
  closePrice: number
  highPrice: number
  lowPrice: number
  increaseRateDay: number
  /**
   * 当日持仓市值（仅当玩家持有该股票时有值）
   */
  holdMarketValue: number
  /**
   * 当日累计投入成本
   */
  holdCost: number
  /**
   * 当日持仓收益
   */
  holdProfit: number
  /**
   * 当日持仓收益率（%）
   */
  holdProfitRate: number
}

/**
 * 走势图买卖标记点（StockChartVo.trades 元素）
 */
export interface TradeMarker {
  /**
   * 赛季内第几个交易日
   */
  tradeDay: number
  /**
   * BUY / SELL
   */
  tradeType: 'BUY' | 'SELL'
  price: number
  quantity: number
  amount: number
}
