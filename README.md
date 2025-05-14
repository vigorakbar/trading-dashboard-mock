# Trading Dashboard Mock Application

A real-time trading dashboard application that simulates live market data with interactive charts and live updates. This application consists of a React-based frontend and a Node.js backend that generates mock trading data.

## Features

- **Symbol Selector**: Choose from different trading symbols to view their data
- **Live Ticker**: Real-time price updates using WebSocket connection
- **Interactive Stock Charts**: 
  - OHLC (Open, High, Low, Close) candlestick chart
  - Volume data visualization
  - Stock tools for technical analysis
- **Live Chart Updates**: Real-time OHLC data updates via WebSocket
- **Responsive Design**: Modern UI that adapts to different screen sizes

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Highcharts Stock for advanced charting
- WebSocket for real-time data
- Modern UI components

### Backend
- Node.js
- WebSocket server for real-time data streaming
- Mock data generation for trading symbols

## Project Structure

```
trading-sim/
├── trading-dashboard-frontend/    # React frontend application
│   ├── src/                      # Source code
│   ├── public/                   # Static assets
│   └── package.json             # Frontend dependencies
│
└── trading-dashboard-backend/    # Node.js backend server
    ├── server.js                # Main server file
    └── package.json            # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trading-sim
```

2. Install frontend dependencies:
```bash
cd trading-dashboard-frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../trading-dashboard-backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd trading-dashboard-backend
node server.js
```

2. In a new terminal, start the frontend development server:
```bash
cd trading-dashboard-frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Development

### Frontend Development
- The frontend is built with React and TypeScript
- Uses Vite for fast development and building
- Highcharts Stock is used for advanced charting capabilities
- WebSocket connection is established for real-time data updates

### Backend Development
- Node.js server generates mock trading data
- WebSocket server handles real-time data streaming
- Mock data includes OHLC and volume data for selected symbols

