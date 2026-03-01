import Link from 'next/link';

export default function CourseCard({ course }: { course: any }) {
    const { title, instructor, thumbnailUrl, description } = course.attributes || course;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group cursor-pointer">
            <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 dark:text-white">{title || 'Untitled Course'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{instructor || 'Unknown Instructor'}</p>
                <div className="mt-auto">
                    <Link href={`/courses/${course.id}`}>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors">
                            Continue Learning
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
