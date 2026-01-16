"use client";
import { Building2, Target, Users, Award, Hammer, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-stone-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-amber-600 to-stone-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">Về Thanh Trúc Plaster</h1>
          </div>
          <p className="text-xl md:text-2xl font-semibold mb-2">
            Chuyên gia thi công thạch cao và nội thất
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Thanh Trúc Plaster được thành lập với sứ mệnh mang đến những giải pháp 
              thi công thạch cao và nội thất chất lượng cao, sáng tạo và bền vững. 
              Chúng tôi tin rằng mỗi không gian đều xứng đáng được thiết kế và thi công 
              với sự tỉ mỉ, chuyên nghiệp để tạo nên những công trình hoàn hảo nhất.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">Chất Lượng</h3>
            <p className="text-gray-600">
              Cam kết sử dụng vật liệu cao cấp và quy trình thi công 
              chuyên nghiệp, đảm bảo độ bền và thẩm mỹ cho mọi công trình.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-stone-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Sáng Tạo</h3>
            <p className="text-gray-600">
              Đội ngũ thiết kế giàu kinh nghiệm, luôn cập nhật xu hướng 
              mới nhất để tạo ra những không gian độc đáo và ấn tượng.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">Chuyên Nghiệp</h3>
            <p className="text-gray-600">
              Tư vấn tận tâm, thi công đúng tiến độ và hỗ trợ khách hàng 
              chu đáo trong suốt quá trình thực hiện dự án.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center text-amber-800 mb-8">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: "Trần Thạch Cao", 
                desc: "Thi công trần phẳng, trần giật cấp, trần chìm đèn, trần 3D với đa dạng kiểu dáng" 
              },
              { 
                title: "Vách Ngăn Thạch Cao", 
                desc: "Vách ngăn phòng, vách trang trí, vách cách âm chuyên nghiệp" 
              },
              { 
                title: "Thiết Kế Nội Thất", 
                desc: "Thiết kế và thi công nội thất trọn gói cho nhà ở, văn phòng, showroom" 
              },
              { 
                title: "Sơn & Hoàn Thiện", 
                desc: "Dịch vụ sơn tường, hoàn thiện bề mặt với chất lượng cao cấp" 
              }
            ].map((service, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <Hammer className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{service.title}</h4>
                  <p className="text-sm text-gray-600">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-linear-to-r from-amber-600 to-stone-700 rounded-2xl p-8 shadow-lg text-white mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Kinh Nghiệm & Thành Tựu</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <p className="text-amber-100">Năm kinh nghiệm</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <p className="text-amber-100">Dự án hoàn thành</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <p className="text-amber-100">Khách hàng hài lòng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">Đội Ngũ Chuyên Nghiệp</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Chúng tôi tự hào với đội ngũ kỹ thuật viên, thợ thi công lành nghề 
            và nhiệt huyết, luôn đặt chất lượng công trình lên hàng đầu.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Target className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="font-semibold">Kiến Trúc Sư</p>
              <p className="text-sm text-gray-600">Thiết kế sáng tạo</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Hammer className="h-6 w-6 text-stone-500 mx-auto mb-2" />
              <p className="font-semibold">Thợ Thi Công</p>
              <p className="text-sm text-gray-600">Tay nghề cao</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold">Tư Vấn Viên</p>
              <p className="text-sm text-gray-600">Hỗ trợ tận tâm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
