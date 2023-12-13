
const HomeFooterSection = () => {
    return (
        <footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-900">
    <div className="sm:flex sm:items-center sm:justify-between">
        <a href="https://www.facebook.com/abysanimalcliniccalamba" className="flex items-center mb-4 sm:mb-0">
            <img src="/agrivet.png" className="h-12 mr-3" alt="ABYS LOGO" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Abys</span>
        </a>
        <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
                <a href="/" className="mr-4 hover:underline md:mr-6 ">Home</a>
            </li>
            <li>
                <a href="About-page" className="mr-4 hover:underline md:mr-6">About Us</a>
            </li>
            <li>
                <a href="Services-page" className="mr-4 hover:underline md:mr-6 ">Services</a>
            </li>
            <li>
                <a href="Branch-page" className="hover:underline">Branch</a> 
            </li>
        </ul>
    </div>
    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023-2024 <a href="https://www.facebook.com/citycollegeofcalamba" className="hover:underline">City College of Calamba</a>. All Rights Reserved.
    </span>
</footer>
    )
}

export default HomeFooterSection
