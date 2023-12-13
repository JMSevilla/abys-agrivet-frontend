type HomeFeatureSectionSecondLayerProps = {
  children : React.ReactNode
}

const HomeFeatureSectionSecondLayer: React.FC<HomeFeatureSectionSecondLayerProps> = ({children}) => {
    return (
        <div className="bg-white py-10 sm:py-0">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-900 sm:text-5xl">
                WHERE TO FIND US
              </p>
              <p className="mt-6 text-lg leading-6 text-gray-600">
              We currently have five branches conveniently located in Calamba and Batangas City,
              Each one equipped and ready to provide you with the highest quality in pet health care.​
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-y-5 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {children}
              </dl>
            </div>
          </div>
        </div>
      )
}

export default HomeFeatureSectionSecondLayer

  