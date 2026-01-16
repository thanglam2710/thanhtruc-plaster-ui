import { Shield, CheckCircle, XCircle, Clock, Phone } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Chính Sách Bảo Hành</h1>
            </div>
            <p className="text-lg text-gray-600">
              Cam kết chất lượng và hỗ trợ khách hàng lâu dài
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cam Kết Bảo Hành</h2>
              <p className="text-gray-700 leading-relaxed">
                Thanh Trúc Plaster cam kết bảo hành chất lượng thi công và vật liệu 
                cho mọi công trình. Chúng tôi luôn sẵn sàng hỗ trợ và khắc phục 
                mọi vấn đề phát sinh trong thời gian bảo hành.
              </p>
            </section>

            {/* Warranty Coverage */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                1. Phạm Vi Bảo Hành
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Bảo hành thi công:</h3>
                  <div className="space-y-2 text-gray-700 ml-4">
                    <p>• Trần thạch cao: 24 tháng</p>
                    <p>• Vách ngăn thạch cao: 24 tháng</p>
                    <p>• Sơn hoàn thiện: 12 tháng</p>
                    <p>• Hệ thống khung xương: 36 tháng</p>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Bảo hành vật liệu:</h3>
                  <div className="space-y-2 text-gray-700 ml-4">
                    <p>• Tấm thạch cao: Theo bảo hành nhà sản xuất (12-24 tháng)</p>
                    <p>• Khung xương thép: 36 tháng</p>
                    <p>• Phụ kiện và vật liệu hoàn thiện: 12 tháng</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Warranty Conditions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Điều Kiện Bảo Hành</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Công trình được sử dụng đúng mục đích và trong điều kiện bình thường</p>
                <p>• Không có sự can thiệp, sửa chữa bởi bên thứ ba</p>
                <p>• Khách hàng thực hiện bảo dưỡng định kỳ theo hướng dẫn</p>
                <p>• Có biên bản nghiệm thu và bàn giao công trình</p>
                <p>• Thông báo sự cố trong vòng 7 ngày kể từ khi phát hiện</p>
              </div>
            </section>

            {/* Exclusions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-600" />
                3. Trường Hợp Không Bảo Hành
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Hư hỏng do thiên tai, hỏa hoạn, lũ lụt</p>
                <p>• Hư hỏng do sử dụng sai mục đích hoặc quá tải</p>
                <p>• Hư hỏng do va đập, tác động cơ học từ bên ngoài</p>
                <p>• Công trình đã được sửa chữa bởi đơn vị khác</p>
                <p>• Hư hỏng do ẩm mốc, thấm nước từ kết cấu bên ngoài</p>
                <p>• Khách hàng không thực hiện thanh toán đầy đủ theo hợp đồng</p>
              </div>
            </section>

            {/* Warranty Process */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                4. Quy Trình Yêu Cầu Bảo Hành
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Liên hệ hotline</h4>
                    <p className="text-gray-600 text-sm">Gọi hotline hoặc gửi email thông báo sự cố</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Cung cấp thông tin</h4>
                    <p className="text-gray-600 text-sm">Cung cấp hợp đồng, biên bản nghiệm thu và hình ảnh sự cố</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Khảo sát hiện trường</h4>
                    <p className="text-gray-600 text-sm">Kỹ thuật viên đến khảo sát trong vòng 24-48 giờ</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Xác nhận bảo hành</h4>
                    <p className="text-gray-600 text-sm">Xác định nguyên nhân và phương án khắc phục</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-blue-600">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Thực hiện sửa chữa</h4>
                    <p className="text-gray-600 text-sm">Khắc phục sự cố trong thời gian cam kết (3-7 ngày)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Maintenance Tips */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Hướng Dẫn Bảo Dưỡng</h2>
              <div className="bg-amber-50 rounded-lg p-6">
                <div className="space-y-3 text-gray-700">
                  <p>• Vệ sinh bề mặt thạch cao bằng khăn mềm, tránh dùng hóa chất mạnh</p>
                  <p>• Kiểm tra và sửa chữa ngay các vết nứt nhỏ để tránh lan rộng</p>
                  <p>• Đảm bảo thông gió tốt, tránh ẩm mốc</p>
                  <p>• Không treo vật nặng quá tải trọng cho phép</p>
                  <p>• Kiểm tra định kỳ 6 tháng/lần để phát hiện sớm các vấn đề</p>
                </div>
              </div>
            </section>

            {/* Extended Warranty */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Gói Bảo Hành Mở Rộng</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Khách hàng có thể đăng ký gói bảo hành mở rộng để kéo dài thời gian 
                bảo hành và nhận thêm các dịch vụ bảo dưỡng định kỳ.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Gói Cơ Bản</h4>
                  <p className="text-sm text-gray-600 mb-2">Thêm 12 tháng bảo hành</p>
                  <p className="text-sm text-gray-600">Bảo dưỡng 1 lần/năm</p>
                </div>
                <div className="border-2 border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">Gói Cao Cấp</h4>
                  <p className="text-sm text-gray-600 mb-2">Thêm 24 tháng bảo hành</p>
                  <p className="text-sm text-gray-600">Bảo dưỡng 2 lần/năm + ưu tiên hỗ trợ</p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Phone className="h-6 w-6 text-green-600" />
                Liên Hệ Bảo Hành
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>📧 Email: warranty@thanhtrucplaster.vn</p>
                <p>📞 Hotline: 0123 456 789</p>
                <p>⏰ Thời gian hỗ trợ: 8:00 - 20:00 (cả tuần)</p>
                <p>🚨 Khẩn cấp: 0987 654 321 (24/7)</p>
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
