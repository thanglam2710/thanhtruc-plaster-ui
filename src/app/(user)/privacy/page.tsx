import { Lock, Eye, Shield, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-stone-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-full">
                <Lock className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Chính Sách Quyền Riêng Tư</h1>
            </div>
            <p className="text-lg text-gray-600">
              Cam kết bảo vệ thông tin cá nhân của khách hàng
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Mục Đích Thu Thập Thông Tin</h2>
              <p className="text-gray-700 leading-relaxed">
                Thanh Trúc Plaster thu thập thông tin cá nhân để cung cấp dịch vụ tư vấn, 
                thiết kế và thi công tốt nhất, bao gồm báo giá dự án, lên kế hoạch thi công 
                và hỗ trợ khách hàng sau bàn giao.
              </p>
            </section>

            {/* Information Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                2. Thông Tin Chúng Tôi Thu Thập
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Thông tin cá nhân:</h3>
                  <div className="space-y-2 text-gray-700 ml-4">
                    <p>• Họ tên và thông tin liên hệ (email, số điện thoại)</p>
                    <p>• Địa chỉ công trình (nếu có)</p>
                    <p>• Yêu cầu thiết kế và thi công cụ thể</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Thông tin dự án:</h3>
                  <div className="space-y-2 text-gray-700 ml-4">
                    <p>• Diện tích và loại công trình</p>
                    <p>• Hình ảnh và bản vẽ thiết kế</p>
                    <p>• Ngân sách và thời gian mong muốn</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Tư vấn và báo giá dự án</p>
                <p>• Thiết kế và lập kế hoạch thi công</p>
                <p>• Gửi thông báo về tiến độ dự án</p>
                <p>• Hỗ trợ bảo hành và chăm sóc khách hàng</p>
                <p>• Cải thiện chất lượng dịch vụ</p>
              </div>
            </section>

            {/* Data Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                4. Bảo Mật Thông Tin
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Mã hóa dữ liệu nhạy cảm bằng công nghệ SSL</p>
                <p>• Giới hạn quyền truy cập thông tin cá nhân</p>
                <p>• Lưu trữ thông tin trên hệ thống bảo mật</p>
                <p>• Kiểm tra và cập nhật biện pháp bảo mật định kỳ</p>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Chia Sẻ Thông Tin</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Chúng tôi KHÔNG bán hoặc cho thuê thông tin cá nhân của bạn. 
                Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <div className="space-y-2 text-gray-700 ml-4">
                <p>• Nhà cung cấp vật liệu và thiết bị (khi cần thiết cho dự án)</p>
                <p>• Đối tác thi công (với sự đồng ý của khách hàng)</p>
                <p>• Theo yêu cầu pháp lý hoặc cơ quan nhà nước</p>
              </div>
            </section>

            {/* User Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-purple-600" />
                6. Quyền Của Khách Hàng
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>• Quyền truy cập và xem thông tin cá nhân</p>
                <p>• Quyền chỉnh sửa và cập nhật thông tin</p>
                <p>• Quyền yêu cầu xóa dữ liệu cá nhân</p>
                <p>• Quyền từ chối nhận thông tin marketing</p>
                <p>• Quyền khiếu nại về việc xử lý dữ liệu</p>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Cookie & Công Nghệ Theo Dõi</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, 
                phân tích lưu lượng truy cập và cá nhân hóa nội dung. 
                Bạn có thể tắt cookie trong cài đặt trình duyệt.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Thời Gian Lưu Trữ Dữ Liệu</h2>
              <div className="space-y-3 text-gray-700">
                <p>• Thông tin dự án: 5 năm cho mục đích bảo hành và hỗ trợ</p>
                <p>• Thông tin liên hệ: Đến khi khách hàng yêu cầu xóa</p>
                <p>• Hồ sơ thiết kế: 3 năm sau khi hoàn thành dự án</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Thay Đổi Chính Sách</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi sẽ cập nhật chính sách này khi cần thiết và thông báo 
                qua email hoặc website 15 ngày trước khi thay đổi có hiệu lực.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-amber-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Thông Tin Liên Hệ</h2>
              <div className="space-y-2 text-gray-700">
                <p>📧 Email: info@thanhtrucplaster.vn</p>
                <p>📞 Hotline: 0123 456 789</p>
                <p>📍 Địa chỉ: [Địa chỉ công ty]</p>
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
