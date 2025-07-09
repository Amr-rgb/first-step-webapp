"use client";

import { Icons } from "../icons";
import Link from "next/link";

interface BranchesProps {
  locale: string;
  nurseryName: string;
}

const Branches = ({ locale, nurseryName }: BranchesProps) => {
  
  const branches = ["القصيم", "حي غرناطة", "المدينة", "مكة المكرمة", "الرياض"];

  const branchColors = [
    "text-[#B12F53] fill-[#B12F53]",
    "text-[#47B881] fill-[#47B881]",
    "text-[#3B82F6] fill-[#3B82F6]",
    "text-[#D9534F] fill-[#D9534F]",
    "text-[#FFAD0D] fill-[#FFAD0D]",
  ];

  return (
    <section className="my-10 container mx-auto px-4 xl:px-8">
      <h2 className="mb-6 heading-3 text-secondary-burgundy text-center">
        فروع الحضانة
      </h2>

      <div className="relative overflow-x-auto overflow-y-hidden px-4">
        <div className="flex flex-nowrap pb-4 min-h-[120px] justify-center">
          {branches.map((branch, index) => (
            <div
              key={branch}
              className={`group relative flex flex-col items-center min-w-48 md:min-w-64 w-48 mb-8 ${branchColors[index]}`}
            >
              <div className="-z-50 w-full h-1 bg-light-gray absolute translate-y-[670%] top-1/2 group-first:w-1/2 group-last:w-1/2 group-first:right-0 group-last:left-0 rtl:group-last:right-0 rtl:group-first:right-auto rtl:group-first:left-0" />

              {/* Branch circle with color based on index */}
              <div
                className={
                  "rounded-full flex items-center justify-center origin-[50%_80%] group-even:rotate-180"
                }
              >
                <Icons.location className="fill-inherit size-20" />
              </div>

              {/* Branch name */}
              <p className="absolute left-1/2 -translate-x-1/2 group-even:top-[20%] group-odd:top-[100%] text-2xl text-center font-bold text-nowrap whitespace-nowrap">
                {branch}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy, Methodology, Goal Section */}
      <div className="mt-20 flex flex-col md:flex-row justify-center gap-8 text-center">
        {/* Philosophy Card */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <img
            src="/assets/illustrations/philosophy.png"
            alt="فلسفتنا"
            className="mx-auto mb-4 w-28 h-28 object-contain"
          />
          <h3 className="text-2xl font-bold text-[#B12F53] mb-2">فلسفتنا</h3>
          <p className="text-gray-700 text-base">
            نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة، تتضمن
            مستوى التفاعل، النشاطات التي شاركوا فيها، وملاحظات عن مهاراتهم
            المختلفة. هذه التقارير تعزز التواصل بين العائلات والمعلمات، مما
            يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
          </p>
        </div>
        {/* Methodology Card */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <img
            src="/assets/illustrations/methodology.png"
            alt="منهجيتنا"
            className="mx-auto mb-4 w-28 h-28 object-contain"
          />
          <h3 className="text-2xl font-bold text-[#B12F53] mb-2">منهجيتنا</h3>
          <p className="text-gray-700 text-base">
            نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة، تتضمن
            مستوى التفاعل، النشاطات التي شاركوا فيها، وملاحظات عن مهاراتهم
            المختلفة. هذه التقارير تعزز التواصل بين العائلات والمعلمات، مما
            يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
          </p>
        </div>
        {/* Goal Card */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <img
            src="/assets/illustrations/goal.png"
            alt="هدفنا"
            className="mx-auto mb-4 w-28 h-28 object-contain"
          />
          <h3 className="text-2xl font-bold text-[#B12F53] mb-2">هدفنا</h3>
          <p className="text-gray-700 text-base">
            نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة، تتضمن
            مستوى التفاعل، النشاطات التي شاركوا فيها، وملاحظات عن مهاراتهم
            المختلفة. هذه التقارير تعزز التواصل بين العائلات والمعلمات، مما
            يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
          </p>
        </div>
      </div>

      {/* Our Programs Section */}
      <section className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-right text-[#22336C] mb-10">
          برامجنا
        </h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {/* Hourly Program */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[220px] max-w-xs mx-auto">
            <img
              src="/assets/illustrations/hourly.png"
              alt="البرنامج المرن بالساعة"
              className="mb-4 w-20 h-20 object-contain"
            />
            <h3 className="text-xl font-bold text-[#22336C] mb-2">
              البرنامج المرن بالساعة
            </h3>
            <div className="text-3xl font-bold text-[#22336C] mb-2">25﷼</div>
            <ul className="text-[#22336C] text-right mb-4 space-y-1">
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
            </ul>
            <Link
              href={`/${locale}/nurseries/${nurseryName}/reservation?program=hourly`}
              className="mt-auto bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-lg px-6 py-2 font-bold transition hover:opacity-90 text-center"
            >
              احجز الآن
            </Link>
          </div>
          {/* Daily Program */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[220px] max-w-xs mx-auto">
            <img
              src="/assets/illustrations/daily.png"
              alt="البرنامج اليومي"
              className="mb-4 w-20 h-20 object-contain"
            />
            <h3 className="text-xl font-bold text-[#22336C] mb-2">
              البرنامج اليومي
            </h3>
            <div className="text-3xl font-bold text-[#22336C] mb-2">25﷼</div>
            <ul className="text-[#22336C] text-right mb-4 space-y-1">
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
            </ul>
            <Link
              href={`/${locale}/nurseries/${nurseryName}/reservation?program=daily`}
              className="mt-auto bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-lg px-6 py-2 font-bold transition hover:opacity-90 text-center"
            >
              احجز الآن
            </Link>
          </div>
          {/* Weekly Program */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[220px] max-w-xs mx-auto">
            <img
              src="/assets/illustrations/weekly.png"
              alt="البرنامج الاسبوعي"
              className="mb-4 w-20 h-20 object-contain"
            />
            <h3 className="text-xl font-bold text-[#22336C] mb-2">
              البرنامج الاسبوعي
            </h3>
            <div className="text-3xl font-bold text-[#22336C] mb-2">25﷼</div>
            <ul className="text-[#22336C] text-right mb-4 space-y-1">
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
            </ul>
            <Link
              href={`/${locale}/nurseries/${nurseryName}/reservation?program=weekly`}
              className="mt-auto bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-lg px-6 py-2 font-bold transition hover:opacity-90 text-center"
            >
              احجز الآن
            </Link>
          </div>
          {/* Monthly Program */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center min-w-[220px] max-w-xs mx-auto">
            <img
              src="/assets/illustrations/monthly.png"
              alt="البرنامج الشهري"
              className="mb-4 w-20 h-20 object-contain"
            />
            <h3 className="text-xl font-bold text-[#22336C] mb-2">
              البرنامج الشهري
            </h3>
            <div className="text-3xl font-bold text-[#22336C] mb-2">25﷼</div>
            <ul className="text-[#22336C] text-right mb-4 space-y-1">
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
              <li>خدمة من خدمات البرنامج</li>
            </ul>
            <Link
              href={`/${locale}/nurseries/${nurseryName}/reservation?program=monthly`}
              className="mt-auto bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-lg px-6 py-2 font-bold transition hover:opacity-90 text-center"
            >
              احجز الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Nursery Services Section */}
      <section className="mt-20 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-12">
          خدمات الحضانة
        </h2>
        <div className="flex flex-col gap-16">
          {/* Service 1 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-xl font-bold text-[#22336C] mb-2">
                اسم الخدمة
              </h3>
              <p className="text-gray-700 text-base mb-2">
                نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة،
                تشمل مستوى التفاعل، النشاطات التي شاركوا فيها، والملاحظات في
                مهاراتهم المختلفة. هذه التقارير تعزز التواصل بين العائلات
                والمعلمين، مما يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
              </p>
              <p className="text-gray-700 text-base">
                نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة،
                تشمل مستوى التفاعل، النشاطات التي شاركوا فيها، والملاحظات في
                مهاراتهم المختلفة. هذه التقارير تعزز التواصل بين العائلات
                والمعلمين، مما يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 flex justify-center">
              <div className="w-full max-w-lg h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                <img
                  src="/assets/illustrations/service1.png"
                  alt="اسم الخدمة"
                  className="object-contain w-full h-full opacity-60"
                />
              </div>
            </div>
          </div>
          {/* Service 2 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-lg h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                <img
                  src="/assets/illustrations/service2.png"
                  alt="اسم الخدمة"
                  className="object-contain w-full h-full opacity-60"
                />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#22336C] mb-2">
                اسم الخدمة
              </h3>
              <p className="text-gray-700 text-base mb-2">
                نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة،
                تشمل مستوى التفاعل، النشاطات التي شاركوا فيها، والملاحظات في
                مهاراتهم المختلفة. هذه التقارير تعزز التواصل بين العائلات
                والمعلمين، مما يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
              </p>
              <p className="text-gray-700 text-base">
                نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة،
                تشمل مستوى التفاعل، النشاطات التي شاركوا فيها، والملاحظات في
                مهاراتهم المختلفة. هذه التقارير تعزز التواصل بين العائلات
                والمعلمين، مما يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
              </p>
            </div>
          </div>
          {/* Service 3 */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-xl font-bold text-[#22336C] mb-2">
                اسم الخدمة
              </h3>
              <p className="text-gray-700 text-base mb-2">
                نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة،
                تشمل مستوى التفاعل، النشاطات التي شاركوا فيها، والملاحظات في
                مهاراتهم المختلفة. هذه التقارير تعزز التواصل بين العائلات
                والمعلمين، مما يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
              </p>
              <p className="text-gray-700 text-base">
                نوفر للأباء تقارير يومية تفصيلية عن أداء أطفالهم داخل الحضانة،
                تشمل مستوى التفاعل، النشاطات التي شاركوا فيها، والملاحظات في
                مهاراتهم المختلفة. هذه التقارير تعزز التواصل بين العائلات
                والمعلمين، مما يساعد على متابعة نمو الطفل ودعمه بشكل أفضل.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 flex justify-center">
              <div className="w-full max-w-lg h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                <img
                  src="/assets/illustrations/service3.png"
                  alt="اسم الخدمة"
                  className="object-contain w-full h-full opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nursery Stats Section */}
      <section className="mt-16 mb-10">
        <div className="flex justify-center mb-8">
          <Link
            href={`/${locale}/nurseries/${nurseryName}/reservation`}
            className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-md px-8 py-2 font-bold text-sm shadow-md hover:opacity-90 transition"
          >
            احجز لطفلك الآن
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 text-center">
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            {/* Icon: Nursery Area */}
            <svg
              width="64"
              height="64"
              fill="none"
              viewBox="0 0 64 64"
              className="mb-2"
            >
              <path
                d="M8 56V24L32 8l24 16v32H8Z"
                stroke="#B12F53"
                strokeWidth="3"
              />
              <path d="M24 56V40h16v16" stroke="#B12F53" strokeWidth="3" />
            </svg>
            <div className="text-3xl font-bold text-[#B12F53]">2000</div>
            <div className="text-[#B12F53] font-bold mt-1">
              مساحة الحضانة / متر مربع
            </div>
          </div>
          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            {/* Icon: Classrooms */}
            <svg
              width="64"
              height="64"
              fill="none"
              viewBox="0 0 64 64"
              className="mb-2"
            >
              <path d="M12 16h40v32H12z" stroke="#22336C" strokeWidth="3" />
              <path d="M24 32h16M24 40h16" stroke="#22336C" strokeWidth="3" />
              <circle cx="20" cy="24" r="4" stroke="#22336C" strokeWidth="3" />
            </svg>
            <div className="text-3xl font-bold text-[#22336C]">10</div>
            <div className="text-[#22336C] font-bold mt-1">عدد الفصول</div>
          </div>
          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            {/* Icon: Team */}
            <svg
              width="64"
              height="64"
              fill="none"
              viewBox="0 0 64 64"
              className="mb-2"
            >
              <circle cx="32" cy="20" r="8" stroke="#47B881" strokeWidth="3" />
              <path
                d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"
                stroke="#47B881"
                strokeWidth="3"
              />
              <circle cx="16" cy="28" r="5" stroke="#47B881" strokeWidth="2" />
              <circle cx="48" cy="28" r="5" stroke="#47B881" strokeWidth="2" />
            </svg>
            <div className="text-3xl font-bold text-[#47B881]">21</div>
            <div className="text-[#47B881] font-bold mt-1">
              فريق حضانة الأمل
            </div>
          </div>
        </div>
      </section>

      {/* Nursery Activities Section */}
      <section className="mt-20 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-2">
          نشاطات الحضانة
        </h2>
        <div className="text-center text-[#22336C] mb-8 font-medium">
          رياضة - تعليم - ترفيه - سينما - تجارب علمية - حضانة - استضافة بعد
          المدرسة
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          <img
            src="/assets/activities/activity1.jpg"
            alt="activity1"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity2.jpg"
            alt="activity2"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity3.jpg"
            alt="activity3"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity4.jpg"
            alt="activity4"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity5.jpg"
            alt="activity5"
            className="rounded-2xl object-cover w-full h-64"
          />
          <img
            src="/assets/activities/activity6.jpg"
            alt="activity6"
            className="rounded-2xl object-cover w-full h-64"
          />
        </div>
        <div className="flex justify-center">
          <Link
            href={`/${locale}/nurseries/${nurseryName}/reservation`}
            className="bg-gradient-to-r from-[#6A8DFF] to-[#3B5BDB] text-white rounded-md px-8 py-2 font-bold text-sm shadow-md hover:opacity-90 transition"
          >
            احجز لطفلك الآن
          </Link>
        </div>
      </section>

      {/* Nursery Team Section */}
      <section className="mt-20 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#47B881] mb-8">
          فريق حضانة الأمل
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {/* Member 1 - Skeleton */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl w-40 h-44 mb-2 bg-gray-200 animate-pulse" />
            <div className="text-[#22336C] font-bold">اسم الشخص</div>
            <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
          </div>
          {/* Member 2 - Real Image */}
          <div className="flex flex-col items-center">
            <img
              src="https://picsum.photos/200/250?random=1"
              alt="اسم الشخص"
              className="rounded-2xl object-cover w-40 h-44 mb-2"
            />
            <div className="text-[#22336C] font-bold">اسم الشخص</div>
            <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
          </div>
          {/* Member 3 - Real Image */}
          <div className="flex flex-col items-center">
            <img
              src="https://picsum.photos/200/250?random=2"
              alt="اسم الشخص"
              className="rounded-2xl object-cover w-40 h-44 mb-2"
            />
            <div className="text-[#22336C] font-bold">اسم الشخص</div>
            <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
          </div>
          {/* Member 4 - Real Image */}
          <div className="flex flex-col items-center">
            <img
              src="https://picsum.photos/200/250?random=3"
              alt="اسم الشخص"
              className="rounded-2xl object-cover w-40 h-44 mb-2"
            />
            <div className="text-[#22336C] font-bold">اسم الشخص</div>
            <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
          </div>
          {/* Member 5 - Skeleton */}
          <div className="flex flex-col items-center">
            <div className="rounded-2xl w-40 h-44 mb-2 bg-gray-200 animate-pulse" />
            <div className="text-[#22336C] font-bold">اسم الشخص</div>
            <div className="text-gray-500 text-sm">مهتمه في الحضانة</div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Branches;
