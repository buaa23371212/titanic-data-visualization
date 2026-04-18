import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { Passenger } from '../../types/passenger';
import { PORTS, MAP_CONFIG, Port, TITANIC_ROUTE, ROUTE_STYLES } from '../../utils/constants';
import { 
  calculatePortStats, 
  getMarkerColorBySurvivalRate, 
  formatPortStatsForDisplay 
} from '../../utils/portUtils';

// 引入Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface PortDistributionMapProps {
  passengers: Passenger[];
  className?: string;
  height?: string;
  selectedPort?: string | null;
  onPortSelect?: (portCode: string | null) => void;
}

// 自定义图例控件组件
const LegendControl: React.FC = () => {
  const map = useMap();
  
  React.useEffect(() => {
    // 创建图例容器
    const legend = L.control({ position: 'bottomleft' });
    
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'legend-control');
      
      // 创建图例内容
      const createLegendContent = (isExpanded: boolean) => {
        if (!isExpanded) {
          return `
            <div class="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 cursor-pointer hover:bg-white transition-all duration-200 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span class="text-xs font-medium">图例</span>
            </div>
          `;
        }
        
        return `
          <div class="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <!-- 标题栏 -->
            <div class="flex items-center justify-between p-3 border-b border-gray-200">
              <h4 class="font-semibold text-sm">图例</h4>
              <button class="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <!-- 图例内容 -->
            <div class="p-3">
              <!-- 港口标记图例 -->
              <div class="mb-3">
                <h5 class="font-medium text-xs mb-1 text-gray-700">港口生存率</h5>
                <div class="space-y-1 text-xs">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>低生存率 (0-25%)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>中生存率 (25-50%)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>中高生存率 (50-75%)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>高生存率 (75-100%)</span>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    标记大小表示乘客数量
                  </div>
                </div>
              </div>
              
              <!-- 航线图例 -->
              <div class="pt-2 border-t border-gray-200">
                <h5 class="font-medium text-xs mb-1 text-gray-700">泰坦尼克号航线</h5>
                <div class="space-y-1 text-xs">
                  <div class="flex items-center">
                    <div class="w-4 h-1 bg-red-600 mr-2" style="border-radius: 2px; opacity: 0.8;"></div>
                    <span>航行路线</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>港口 (停靠点)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-2 flex items-center justify-center text-white text-xs">🚢</div>
                    <span>沉船地点</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      };
      
      div.innerHTML = `
        <div class="legend-minimized">
          ${createLegendContent(false)}
        </div>
        <div class="legend-content" style="display: none;">
          ${createLegendContent(true)}
        </div>
      `;
      
      // 添加点击事件处理
      const minimizedDiv = div.querySelector('.legend-minimized div');
      const contentDiv = div.querySelector('.legend-content');
      const closeButton = div.querySelector('button');
      
      if (minimizedDiv) {
        minimizedDiv.addEventListener('click', () => {
          if (contentDiv) {
            contentDiv.style.display = 'block';
            minimizedDiv.style.display = 'none';
          }
        });
      }
      
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          if (contentDiv && minimizedDiv) {
            contentDiv.style.display = 'none';
            minimizedDiv.style.display = 'block';
          }
        });
      }
      
      return div;
    };
    
    // 添加图例到地图
    legend.addTo(map);
    
    // 清理函数
    return () => {
      map.removeControl(legend);
    };
  }, [map]);
  
  return null;
};

// 自定义标记图标组件
const createCustomMarkerIcon = (color: string, size: number) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size * 0.4}px;
      ">⚓</div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

export const PortDistributionMap: React.FC<PortDistributionMapProps> = ({
  passengers,
  className = 'h-96',
  height = '400px',
  selectedPort,
  onPortSelect
}) => {
  // 地图引用
  const mapRef = React.useRef<L.Map>(null);
  
  // 计算所有港口的统计数据
  const portStats = React.useMemo(() => {
    const stats: Record<string, ReturnType<typeof calculatePortStats>> = {};
    PORTS.forEach(port => {
      stats[port.code] = calculatePortStats(passengers, port.code);
    });
    return stats;
  }, [passengers]);

  return (
    <div className={`${className} bg-white rounded-lg shadow-lg overflow-hidden`} style={{ height }}>
      <MapContainer 
        center={MAP_CONFIG.center} 
        zoom={MAP_CONFIG.defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        {/* 地图瓦片层 */}
        <TileLayer
          url={MAP_CONFIG.tileLayerUrl}
          attribution={MAP_CONFIG.tileLayerAttribution}
        />
        
        {/* 港口标记 */}
        {PORTS.map(port => {
          const stats = portStats[port.code];
          const displayStats = formatPortStatsForDisplay(port, stats);
          
          // 根据生存率设置标记颜色
          const markerColor = getMarkerColorBySurvivalRate(stats.survivalRate);
          
          // 根据乘客数量设置标记大小（基础大小20px + 每10个乘客增加1px，最大40px）
          const markerSize = Math.min(40, Math.max(20, 20 + Math.floor(stats.totalPassengers / 10)));
          
          const customIcon = createCustomMarkerIcon(markerColor, markerSize);
          
          // 处理点击事件
          const handleClick = () => {
            // 如果点击的是已选中的港口，则取消选中
            if (selectedPort === port.code) {
              onPortSelect?.(null);
            } else {
              onPortSelect?.(port.code);
            }
          };

          // 当港口被选中时，自动打开弹窗；当取消选中时，收起弹窗
          const markerRef = React.useRef<L.Marker>(null);
          
          React.useEffect(() => {
            if (selectedPort === port.code && markerRef.current) {
              // 延迟打开弹窗以确保地图已加载
              setTimeout(() => {
                markerRef.current?.openPopup();
              }, 100);
            } else if (selectedPort === null && markerRef.current) {
              // 当取消选中时，收起弹窗
              setTimeout(() => {
                markerRef.current?.closePopup();
              }, 100);
            }
          }, [selectedPort, port.code]);

          return (
            <Marker 
              key={port.code} 
              position={port.coordinates}
              icon={customIcon}
              ref={markerRef}
              eventHandlers={{
                click: handleClick
              }}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="min-w-64 p-2">
                  <h3 className="font-bold text-lg text-blue-800 mb-2">{displayStats.portName}</h3>
                  
                  {/* 航线信息 - 添加日期 */}
                  {(() => {
                    const routePoint = TITANIC_ROUTE.find(p => p.name === port.fullName);
                    if (routePoint) {
                      return (
                        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-center text-sm text-blue-700">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">停靠日期:</span>
                            <span className="ml-1">{routePoint.date}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* 基础统计信息 */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-sm">
                      <span className="font-semibold">总乘客数:</span>
                      <span className="ml-1 text-blue-600">{displayStats.totalPassengers}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">生存人数:</span>
                      <span className="ml-1 text-green-600">{displayStats.survived}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">生存率:</span>
                      <span className="ml-1 text-green-600">{displayStats.survivalRate}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">平均票价:</span>
                      <span className="ml-1 text-purple-600">{displayStats.averageFare}</span>
                    </div>
                  </div>

                  {/* 舱位分布 */}
                  <div className="mb-2">
                    <h4 className="font-semibold text-sm mb-1">舱位分布:</h4>
                    <div className="flex space-x-2 text-xs">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        一等舱: {displayStats.classDistribution.first}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        二等舱: {displayStats.classDistribution.second}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        三等舱: {displayStats.classDistribution.third}
                      </span>
                    </div>
                  </div>

                  {/* 性别分布 */}
                  <div>
                    <h4 className="font-semibold text-sm mb-1">性别分布:</h4>
                    <div className="flex space-x-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        男性: {displayStats.sexDistribution.male}
                      </span>
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
                        女性: {displayStats.sexDistribution.female}
                      </span>
                    </div>
                  </div>

                  {/* 港口描述 */}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">{port.description}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* 泰坦尼克号航线 */}
        <Polyline
          positions={TITANIC_ROUTE.map(point => point.coordinates)}
          color={ROUTE_STYLES.lineColor}
          weight={ROUTE_STYLES.lineWeight}
          opacity={ROUTE_STYLES.lineOpacity}
          dashArray={ROUTE_STYLES.lineDashArray}
        />
        
        {/* 航线点标记 - 只显示沉船地点 */}
        {TITANIC_ROUTE.filter(point => point.name === '沉船地点').map((point, index) => (
          <Marker 
            key={`route-${index}`} 
            position={point.coordinates}
            icon={L.divIcon({
              html: `
                <div style="
                  background-color: ${ROUTE_STYLES.shipwreckColor};
                  width: ${ROUTE_STYLES.shipwreckRadius * 2}px;
                  height: ${ROUTE_STYLES.shipwreckRadius * 2}px;
                  border-radius: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 12px;
                ">
                  🚢
                </div>
              `,
              className: 'route-marker',
              iconSize: [ROUTE_STYLES.shipwreckRadius * 2, ROUTE_STYLES.shipwreckRadius * 2],
              iconAnchor: [ROUTE_STYLES.shipwreckRadius, ROUTE_STYLES.shipwreckRadius]
            })}
          >
            <Popup className="route-popup" maxWidth={300}>
              <div className="min-w-48 p-2">
                <h3 className="font-bold text-lg mb-1">{point.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">日期:</span> {point.date}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-red-600 font-semibold">
                    🚨 泰坦尼克号在此沉没，1523人遇难
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 自定义图例控件 */}
        <LegendControl />
      </MapContainer>
    </div>
  );
};

// 声明L变量以避免TypeScript错误
declare global {
  var L: typeof import('leaflet');
}

export default PortDistributionMap;