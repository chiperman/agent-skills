#!/usr/bin/env python3
import json
import os
import subprocess
import argparse
import shlex
from datetime import datetime, timedelta

try:
    import pandas as pd
except ImportError:
    pd = None
    print("Warning: pandas is not installed. Technical indicators (MA/EMA) will not be calculated.")

DATA_DIR = ".invest-data"

def run_command(cmd):
    try:
        result = subprocess.run(shlex.split(cmd), check=True, capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command {cmd}: {e}")
        return None

def get_last_friday():
    today = datetime.now()
    days_since_friday = (today.weekday() - 4) % 7
    if days_since_friday == 0:
        friday = today - timedelta(days=7)
    else:
        friday = today - timedelta(days=days_since_friday)
    return friday.strftime("%Y-%m-%d")

def is_option(symbol):
    return len(symbol.split('.')[0]) > 10

def calculate_indicators(kline_data):
    if not pd or not kline_data:
        return kline_data
    
    df = pd.DataFrame(kline_data)
    df['close'] = df['close'].astype(float)
    df['ma5'] = df['close'].rolling(5).mean().fillna(0)
    df['ma20'] = df['close'].rolling(20).mean().fillna(0)
    df['ma120'] = df['close'].rolling(120).mean().fillna(0)
    df['ma200'] = df['close'].rolling(200).mean().fillna(0)
    # EMA
    df['ema20'] = df['close'].ewm(span=20, adjust=False).mean().fillna(0)
    
    # Rounding for JSON size
    for col in ['ma5', 'ma20', 'ma120', 'ma200', 'ema20']:
        df[col] = df[col].round(3)
        
    return df.to_dict(orient='records')

def fetch_data(start_date=None, end_date=None):
    today = datetime.now()
    today_str = today.strftime("%Y-%m-%d")
    
    if not end_date: end_date = today_str
    if not start_date: start_date = get_last_friday()

    date_dir = os.path.join(DATA_DIR, f"{start_date}_to_{end_date}")
    news_dir = os.path.join(date_dir, "news")
    kline_dir = os.path.join(date_dir, "kline")
    metrics_dir = os.path.join(date_dir, "metrics")
    
    for d in [news_dir, kline_dir, metrics_dir]:
        if not os.path.exists(d): os.makedirs(d)

    print(f"Fetching US data (V2) from {start_date} to {end_date}...")

    # 1. Benchmarks
    benchmarks = ["QQQ.US", "VOO.US"]
    benchmark_data = {}
    for b in benchmarks:
        print(f"Fetching benchmark {b}...")
        klines = run_command(f"longbridge kline {b} --count 200 --format json")
        if klines:
            data = calculate_indicators(json.loads(klines))
            benchmark_data[b] = data
            with open(os.path.join(kline_dir, f"{b}.json"), "w") as f:
                json.dump(data, f)

    # 2. Portfolio & News & Kline & Metrics
    print("Fetching portfolio...")
    portfolio_json = run_command("longbridge portfolio --format json")
    if portfolio_json:
        with open(os.path.join(date_dir, "portfolio.json"), "w") as f:
            f.write(portfolio_json)
        
        p_data = json.loads(portfolio_json)
        symbols = [h['symbol'] for h in p_data.get('holdings', [])]
        for symbol in symbols:
            try:
                # News
                if not is_option(symbol):
                    print(f"Fetching news for {symbol}...")
                    news = run_command(f"longbridge news {symbol} --count 10 --format json")
                    if news:
                        with open(os.path.join(news_dir, f"{symbol}.json"), "w") as f:
                            f.write(news)
                
                # Kline (200 for indicators)
                print(f"Fetching kline for {symbol}...")
                klines = run_command(f"longbridge kline {symbol} --count 200 --format json")
                if klines:
                    data = calculate_indicators(json.loads(klines))
                    with open(os.path.join(kline_dir, f"{symbol}.json"), "w") as f:
                        json.dump(data, f)
                
                # Metrics (calc-index & capital flow)
                print(f"Fetching metrics for {symbol}...")
                idx = run_command(f"longbridge calc-index {symbol} --format json")
                if idx:
                    with open(os.path.join(metrics_dir, f"{symbol}_idx.json"), "w") as f:
                        f.write(idx)
                
                cap = run_command(f"longbridge capital {symbol} --flow --format json")
                if cap:
                    with open(os.path.join(metrics_dir, f"{symbol}_cap.json"), "w") as f:
                        f.write(cap)
                        
            except Exception as e:
                print(f"Error processing symbol {symbol}: {e}")

    # 3. Orders
    print("Fetching order history...")
    orders_json = run_command(f"longbridge order --history --start {start_date} --end {end_date} --format json")
    if orders_json:
        with open(os.path.join(date_dir, "orders.json"), "w") as f:
            f.write(orders_json)

    # 4. Market Temp
    print("Fetching US market temperature...")
    market_temp = run_command("longbridge market-temp US --format json")
    if market_temp:
        with open(os.path.join(date_dir, "market_temp.json"), "w") as f:
            f.write(market_temp)

    print(f"V2 Data fetch complete. Stored in {date_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch Longbridge investment data V2.")
    parser.add_argument("--start", help="Start date (YYYY-MM-DD)")
    parser.add_argument("--end", help="End date (YYYY-MM-DD)")
    args = parser.parse_args()
    fetch_data(args.start, args.end)
