import { FileText, Shield, AlertCircle, DollarSign } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Điều Khoản Sử Dụng</h1>
            </div>
            <p className="text-lg text-gray-600">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Giới Thiệu</h2>
              <p className="text-gray-700 leading-relaxed">
                Chào mừng bạn đến với Thanh Trúc Plaster. 
                Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ 
                các điều khoản và điều kiện sử dụng được quy định dưới đây.
              </p>
            </section>

            {/* Service Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                2. Thỏa Thuận Dịch Vụ
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Khách hàng phải cung cấp thông tin chính xác về dự án</p>
                <p>• Mọi thay đổi thiết kế phải được thông báo trước khi thi công</p>
                <p>• Khách hàng có trách nhiệm chuẩn bị mặt bằng thi công</p>
                <p>• Tuân thủ các quy định về an toàn lao động tại công trình</p>
              </div>
            </section>

            {/* Quotation Process */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Quy Trình Báo Giá & Hợp Đồng</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Báo giá có hiệu lực trong vòng 30 ngày kể từ ngày phát hành</p>
                <p>• Giá có thể thay đổi nếu có sự biến động về vật liệu</p>
                <p>• Hợp đồng chỉ có hiệu lực khi có chữ ký của cả hai bên</p>
                <p>• Mọi thay đổi hợp đồng phải được lập thành phụ lục bằng văn bản</p>
              </div>
            </section>

            {/* Payment */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-amber-600" />
                4. Thanh Toán
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Đặt cọc 30% giá trị hợp đồng khi ký kết</p>
                <p>• Thanh toán 40% khi hoàn thành 50% khối lượng công việc</p>
                <p>• Thanh toán 30% còn lại khi nghiệm thu và bàn giao công trình</p>
                <p>• Chấp nhận thanh toán bằng tiền mặt hoặc chuyển khoản ngân hàng</p>
              </div>
            </section>

            {/* Project Timeline */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Tiến Độ Thi Công</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Tiến độ được cam kết trong hợp đồng thi công</p>
                <p>• Chậm tiến độ do lỗi nhà thầu sẽ được bồi thường theo hợp đồng</p>
                <p>• Chậm tiến độ do khách hàng hoặc bất khả kháng sẽ được điều chỉnh</p>
                <p>• Thông báo tiến độ định kỳ hàng tuần cho khách hàng</p>
              </div>
            </section>

            {/* Cancellation */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                6. Hủy Hợp Đồng & Hoàn Tiền
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Khách hàng có quyền hủy hợp đồng trước khi bắt đầu thi công</p>
                <p>• Phí hủy hợp đồng: 10% giá trị hợp đồng (chi phí thiết kế và chuẩn bị)</p>
                <p>• Sau khi bắt đầu thi công, phí hủy tính theo khối lượng đã thực hiện</p>
                <p>• Hoàn tiền trong vòng 15 ngày làm việc sau khi thanh lý hợp đồng</p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Sở Hữu Trí Tuệ</h2>
              <p className="text-gray-700 leading-relaxed">
                Mọi bản thiết kế, hình ảnh, và tài liệu kỹ thuật do Thanh Trúc Plaster 
                tạo ra đều thuộc quyền sở hữu của công ty. Khách hàng được quyền sử dụng 
                cho mục đích cá nhân nhưng không được phép sao chép hoặc sử dụng cho 
                mục đích thương mại mà không có sự cho phép bằng văn bản.
              </p>
            </section>

            {/* Quality Assurance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Đảm Bảo Chất Lượng</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Sử dụng vật liệu chính hãng, có nguồn gốc rõ ràng</p>
                <p>• Thi công theo đúng tiêu chuẩn kỹ thuật Việt Nam</p>
                <p>• Nghiệm thu từng hạng mục trước khi chuyển sang công đoạn tiếp theo</p>
                <p>• Bảo hành theo chính sách đã công bố</p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Giới Hạn Trách Nhiệm</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Không chịu trách nhiệm về hư hỏng do thiên tai, hỏa hoạn</p>
                <p>• Không chịu trách nhiệm về chất lượng vật liệu do khách hàng cung cấp</p>
                <p>• Không chịu trách nhiệm về sự chậm trễ do nguyên nhân khách quan</p>
                <p>• Trách nhiệm bồi thường tối đa bằng 100% giá trị hợp đồng</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Thay Đổi Điều Khoản</h2>
              <p className="text-gray-700 leading-relaxed">
                Thanh Trúc Plaster có quyền cập nhật các điều khoản sử dụng khi cần thiết. 
                Thay đổi sẽ có hiệu lực sau 15 ngày kể từ khi đăng tải trên website. 
                Các hợp đồng đã ký kết sẽ tuân theo điều khoản tại thời điểm ký.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Thông Tin Liên Hệ</h2>
              <div className="space-y-2 text-gray-700">
                <p>📧 Email: info@thanhtrucplaster.vn</p>
                <p>📞 Hotline: 0123 456 789</p>
                <p>⏰ Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 7)</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
