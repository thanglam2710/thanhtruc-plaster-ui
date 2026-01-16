import { RotateCcw, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-stone-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <RotateCcw className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Chính Sách Đổi Trả & Hoàn Tiền</h1>
            </div>
            <p className="text-lg text-gray-600">
              Quy định về đổi trả vật liệu và điều chỉnh dự án
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Giới Thiệu</h2>
              <p className="text-gray-700 leading-relaxed">
                Thanh Trúc Plaster cam kết mang đến sự hài lòng tối đa cho khách hàng. 
                Chính sách đổi trả này áp dụng cho vật liệu và các điều chỉnh dự án 
                trong quá trình thi công.
              </p>
            </section>

            {/* Material Returns */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                1. Đổi Trả Vật Liệu
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Vật liệu được chấp nhận đổi trả:</h3>
                  <div className="space-y-2 text-gray-700 ml-4">
                    <p>• Vật liệu chưa sử dụng, còn nguyên bao bì</p>
                    <p>• Vật liệu bị lỗi từ nhà sản xuất</p>
                    <p>• Vật liệu giao sai so với đơn hàng</p>
                    <p>• Vật liệu bị hư hỏng trong quá trình vận chuyển</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Thời gian đổi trả:</h3>
                  <div className="space-y-2 text-gray-700 ml-4">
                    <p>• Vật liệu lỗi: Trong vòng 7 ngày kể từ ngày nhận hàng</p>
                    <p>• Vật liệu dư thừa: Trong vòng 15 ngày sau khi hoàn thành dự án</p>
                    <p>• Phải có hóa đơn và chứng từ mua hàng</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Project Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Điều Chỉnh Thiết Kế & Dự Án</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Trước khi thi công:</strong></p>
                <div className="ml-4 space-y-2">
                  <p>• Miễn phí điều chỉnh thiết kế tối đa 3 lần</p>
                  <p>• Thay đổi vật liệu theo yêu cầu (điều chỉnh giá nếu cần)</p>
                  <p>• Hủy dự án với phí 10% giá trị hợp đồng</p>
                </div>
                <p className="mt-4"><strong>Trong quá trình thi công:</strong></p>
                <div className="ml-4 space-y-2">
                  <p>• Điều chỉnh thiết kế: Tính thêm chi phí theo khối lượng thay đổi</p>
                  <p>• Thay đổi vật liệu: Điều chỉnh giá và thời gian thi công</p>
                  <p>• Tạm dừng dự án: Phí lưu kho 2%/tháng giá trị vật liệu</p>
                </div>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                3. Chính Sách Hủy Dự Án
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Giai đoạn thiết kế (chưa thi công):</h4>
                  <p className="text-gray-700">Phí hủy: 10% giá trị hợp đồng (chi phí thiết kế và chuẩn bị)</p>
                  <p className="text-gray-700">Hoàn lại: 90% số tiền đã đặt cọc</p>
                </div>
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Đã bắt đầu thi công (dưới 30% khối lượng):</h4>
                  <p className="text-gray-700">Phí hủy: 30% giá trị hợp đồng</p>
                  <p className="text-gray-700">Thanh toán: Khối lượng đã thi công + vật liệu đã mua</p>
                </div>
                <div className="border-l-4 border-red-600 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Đã thi công trên 30% khối lượng:</h4>
                  <p className="text-gray-700">Phí hủy: 50% giá trị hợp đồng</p>
                  <p className="text-gray-700">Thanh toán: Toàn bộ khối lượng đã thi công + vật liệu</p>
                </div>
              </div>
            </section>

            {/* Refund Process */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                4. Quy Trình Hoàn Tiền
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Gửi yêu cầu</h4>
                    <p className="text-gray-600 text-sm">Liên hệ qua email hoặc hotline để thông báo hủy/đổi trả</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Xác nhận & thanh lý</h4>
                    <p className="text-gray-600 text-sm">Lập biên bản thanh lý hợp đồng hoặc xác nhận đổi trả vật liệu</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Tính toán chi phí</h4>
                    <p className="text-gray-600 text-sm">Xác định số tiền hoàn lại sau khi trừ các chi phí phát sinh</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Hoàn tiền</h4>
                    <p className="text-gray-600 text-sm">Chuyển khoản trong vòng 15 ngày làm việc</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Non-Returnable Items */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-600" />
                5. Trường Hợp Không Được Đổi Trả
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Vật liệu đã cắt, gia công theo yêu cầu riêng</p>
                <p>• Vật liệu đã sử dụng hoặc lắp đặt</p>
                <p>• Vật liệu bị hư hỏng do lỗi của khách hàng</p>
                <p>• Vật liệu đặt hàng đặc biệt, không có sẵn trong kho</p>
                <p>• Không có hóa đơn hoặc chứng từ mua hàng</p>
                <p>• Quá thời hạn đổi trả quy định</p>
              </div>
            </section>

            {/* Quality Guarantee */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cam Kết Chất Lượng</h2>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="space-y-3 text-gray-700">
                  <p>• Nếu phát hiện lỗi thi công trong vòng 30 ngày sau bàn giao, chúng tôi sẽ sửa chữa miễn phí</p>
                  <p>• Đảm bảo 100% vật liệu chính hãng, có nguồn gốc rõ ràng</p>
                  <p>• Hoàn tiền 100% nếu phát hiện vật liệu giả, kém chất lượng</p>
                  <p>• Hỗ trợ tư vấn miễn phí trong suốt quá trình sử dụng</p>
                </div>
              </div>
            </section>

            {/* Special Cases */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Trường Hợp Đặc Biệt</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Khách hàng không hài lòng với kết quả:</strong></p>
                <div className="ml-4 space-y-2">
                  <p>• Sẽ có buổi họp để tìm hiểu nguyên nhân và giải pháp</p>
                  <p>• Điều chỉnh lại công trình nếu lỗi thuộc về nhà thầu (miễn phí)</p>
                  <p>• Nếu do yêu cầu thay đổi của khách hàng, tính phí theo thực tế</p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Liên Hệ Hỗ Trợ</h2>
              <div className="space-y-2 text-gray-700">
                <p>📧 Email: support@thanhtrucplaster.vn</p>
                <p>📞 Hotline: 0123 456 789</p>
                <p>⏰ Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 7)</p>
              </div>
            </section>

            {/* Effective Date */}
            {/* <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700 font-semibold">
                Chính sách có hiệu lực từ: 17/01/2026
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
