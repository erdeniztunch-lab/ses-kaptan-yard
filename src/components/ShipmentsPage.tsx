// src/components/ShipmentsPage.tsx
import React, { useState } from 'react'
import { 
  Truck, 
  Phone, 
  MessageCircle, 
  Plus,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Package,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Sevkiyat verilerinin türünü tanımlıyoruz (TypeScript için)
interface Shipment {
  id: string
  code: string
  route: string
  loadType: string
  status: 'draft' | 'calling' | 'quotes_received' | 'booked' | 'in_transit' | 'delivered' | 'cancelled'
  date: string
  budget: number
  carrier: string | null
  finalPrice: number | null
  weight?: number
  notes?: string
  urgentLevel?: 'normal' | 'urgent' | 'critical'
}

// Ana component (sayfa)
export const ShipmentsPage = () => {
  // State'ler (sayfanın durumları)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Örnek sevkiyat verileri (normalde veritabanından gelecek)
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: '1',
      code: 'SK240801001',
      route: 'İstanbul → Gaziantep',
      loadType: 'Tekstil Ürünleri',
      status: 'calling',
      date: '2024-08-03',
      budget: 4500,
      carrier: null,
      finalPrice: null,
      weight: 15000,
      notes: 'Özel ambalaj gerekli',
      urgentLevel: 'urgent'
    },
    {
      id: '2', 
      code: 'SK240801002',
      route: 'İstanbul → Ankara',
      loadType: 'Soğutmalı Gıda',
      status: 'booked',
      date: '2024-08-04',
      budget: 3200,
      carrier: 'Mehmet Yılmaz - Yılmaz Nakliyat',
      finalPrice: 3000,
      weight: 8000,
      urgentLevel: 'normal'
    },
    {
      id: '3',
      code: 'SK240801003', 
      route: 'İstanbul → İzmir',
      loadType: 'İnşaat Malzemesi',
      status: 'delivered',
      date: '2024-07-30',
      budget: 2800,
      carrier: 'Ali Demir - Demir Lojistik',
      finalPrice: 2650,
      weight: 12000,
      urgentLevel: 'normal'
    },
    {
      id: '4',
      code: 'SK240801004',
      route: 'İstanbul → Bursa',
      loadType: 'Elektronik Eşya',
      status: 'in_transit',
      date: '2024-08-02',
      budget: 1800,
      carrier: 'Fatma Kaya - Kaya Taşımacılık',
      finalPrice: 1750,
      weight: 5000,
      urgentLevel: 'critical'
    },
    {
      id: '5',
      code: 'SK240801005',
      route: 'İstanbul → Adana',
      loadType: 'Kimyasal Madde',
      status: 'quotes_received',
      date: '2024-08-05',
      budget: 5200,
      carrier: null,
      finalPrice: null,
      weight: 18000,
      urgentLevel: 'normal'
    }
  ])

  // Filtreleme fonksiyonu
  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = !filterStatus || shipment.status === filterStatus
    const matchesSearch = !searchTerm || 
      shipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.loadType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || shipment.date === dateFilter
    
    return matchesStatus && matchesSearch && matchesDate
  })

  // Durum renklerini belirleme
  const getStatusColor = (status: string) => {
    const statusColors = {
      'draft': 'bg-gray-50 text-gray-700 border-gray-200',
      'calling': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'quotes_received': 'bg-blue-50 text-blue-700 border-blue-200',
      'booked': 'bg-green-50 text-green-700 border-green-200',
      'in_transit': 'bg-purple-50 text-purple-700 border-purple-200',
      'delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200'
    }
    return statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  // Durum metinlerini Türkçe yapma
  const getStatusText = (status: string) => {
    const statusTexts = {
      'draft': 'Taslak',
      'calling': 'Aranıyor',
      'quotes_received': 'Teklifler Alındı',
      'booked': 'Rezerve Edildi',
      'in_transit': 'Yolda',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal Edildi'
    }
    return statusTexts[status] || status
  }

  // Aciliyet seviyesi renkleri
  const getUrgencyColor = (level: string) => {
    const colors = {
      'normal': 'bg-green-100 text-green-800',
      'urgent': 'bg-yellow-100 text-yellow-800',
      'critical': 'bg-red-100 text-red-800'
    }
    return colors[level] || colors.normal
  }

  // Aciliyet seviyesi metinleri
  const getUrgencyText = (level: string) => {
    const texts = {
      'normal': 'Normal',
      'urgent': 'Acil',
      'critical': 'Kritik'
    }
    return texts[level] || texts.normal
  }

  // Durum değiştirme fonksiyonu
  const handleStatusChange = (shipmentId: string, newStatus: string) => {
    setShipments(prev => prev.map(ship => 
      ship.id === shipmentId ? { ...ship, status: newStatus as any } : ship
    ))
  }

  // Sevkiyat silme fonksiyonu
  const handleDeleteShipment = (shipmentId: string) => {
    if (confirm('Bu sevkiyatı silmek istediğinizden emin misiniz?')) {
      setShipments(prev => prev.filter(ship => ship.id !== shipmentId))
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Sayfa Başlığı */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sevkiyatlarım</h1>
          <p className="text-gray-600 mt-1">Tüm sevkiyat işlemlerinizi yönetin ve takip edin</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Excel İndir
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Sevkiyat
          </Button>
        </div>
      </div>

      {/* Üst İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Sevkiyat</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Sevkiyat</p>
              <p className="text-2xl font-bold text-orange-600">
                {shipments.filter(s => ['calling', 'booked', 'in_transit'].includes(s.status)).length}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Teslim Edildi</p>
              <p className="text-2xl font-bold text-green-600">
                {shipments.filter(s => s.status === 'delivered').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bu Ay Toplam</p>
              <p className="text-2xl font-bold text-purple-600">
                {shipments.filter(s => s.finalPrice).reduce((sum, s) => sum + (s.finalPrice || 0), 0).toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Filtreler</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="draft">Taslak</option>
              <option value="calling">Aranıyor</option>
              <option value="quotes_received">Teklifler Alındı</option>
              <option value="booked">Rezerve Edildi</option>
              <option value="in_transit">Yolda</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>

          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Kod, rota veya yük tipi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tarih Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Görünüm Modu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Görünüm</label>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Kart
              </button>
            </div>
          </div>
        </div>

        {/* Filtre Temizleme */}
        {(filterStatus || searchTerm || dateFilter) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Aktif filtreler:</span>
            {filterStatus && (
              <Badge variant="outline" className="bg-blue-50">
                Durum: {getStatusText(filterStatus)}
                <button 
                  onClick={() => setFilterStatus('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="bg-blue-50">
                Arama: {searchTerm}
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </Badge>
            )}
            {dateFilter && (
              <Badge variant="outline" className="bg-blue-50">
                Tarih: {dateFilter}
                <button 
                  onClick={() => setDateFilter('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setFilterStatus('')
                setSearchTerm('')
                setDateFilter('')
              }}
            >
              Tümünü Temizle
            </Button>
          </div>
        )}
      </div>

      {/* Sevkiyat Listesi */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Sevkiyat Listesi ({filteredShipments.length} kayıt)
          </h3>
        </div>

        {/* Liste Görünümü */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Sol Taraf - Ana Bilgiler */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{shipment.code}</h3>
                        <Badge variant="outline" className={getStatusColor(shipment.status)}>
                          {getStatusText(shipment.status)}
                        </Badge>
                        {shipment.urgentLevel !== 'normal' && (
                          <Badge className={getUrgencyColor(shipment.urgentLevel)}>
                            {getUrgencyText(shipment.urgentLevel)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="font-medium">{shipment.route}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Package className="w-4 h-4 mr-1" />
                        <span>{shipment.loadType}</span>
                        {shipment.weight && <span className="ml-2">({shipment.weight.toLocaleString()} kg)</span>}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{shipment.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sağ Taraf - Fiyat ve Aksiyonlar */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Bütçe</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {shipment.budget.toLocaleString('tr-TR')} ₺
                      </div>
                      {shipment.finalPrice && (
                        <div className="mt-1">
                          <div className="text-sm text-gray-500">Final Fiyat</div>
                          <div className="text-lg font-bold text-green-600">
                            {shipment.finalPrice.toLocaleString('tr-TR')} ₺
                          </div>
                          <div className="text-xs text-green-600">
                            Tasarruf: {(shipment.budget - shipment.finalPrice).toLocaleString('tr-TR')} ₺
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nakliyeci Bilgisi */}
                    {shipment.carrier && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Nakliyeci</div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {shipment.carrier}
                        </div>
                      </div>
                    )}

                    {/* Aksiyon Butonları */}
                    <div className="flex gap-2">
                      {shipment.status === 'calling' && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <Phone className="w-3 h-3 mr-1" />
                          Tekrar Ara
                        </Button>
                      )}
                      {shipment.carrier && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          WhatsApp
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedShipment(shipment)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Detayları Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            PDF İndir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteShipment(shipment.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Alt Kısım - Notlar */}
                {shipment.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <strong>Notlar:</strong> {shipment.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Kart Görünümü */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">{shipment.code}</h3>
                  <Badge variant="outline" className={getStatusColor(shipment.status)}>
                    {getStatusText(shipment.status)}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{shipment.route}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span className="text-sm">{shipment.loadType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{shipment.date}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Bütçe</span>
                    <span className="font-semibold">{shipment.budget.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  {shipment.finalPrice && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">Final</span>
                      <span className="font-bold text-green-600">{shipment.finalPrice.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  )}
                </div>

                {shipment.carrier && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="text-xs text-gray-500">Nakliyeci</div>
                    <div className="text-sm font-medium">{shipment.carrier}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Detay
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Düzenle</DropdownMenuItem>
                      <DropdownMenuItem>PDF İndir</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Sil</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sonuç Bulunamadı */}
        {filteredShipments.length === 0 && (
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sevkiyat Bulunamadı</h3>
            <p className="text-gray-600 mb-6">Arama kriterlerinize uygun sevkiyat bulunamadı.</p>
            <Button 
              onClick={() => {
                setFilterStatus('')
                setSearchTerm('')
                setDateFilter('')
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}