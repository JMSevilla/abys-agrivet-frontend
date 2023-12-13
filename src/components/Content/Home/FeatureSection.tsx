import { HeartIcon } from '@heroicons/react/20/solid'


export const features = [
  {
    name: 'Grooming, Boarding and Retail.',
    description:
      'Grooming and boarding packages for dogs and cats, and an in-house pet store for all your pet care needs.',
    icon: HeartIcon,
  },
  {
    name: 'Surgery.',
    description: 'Vets In Practice has become a referral center for a wide range of surgical procedures.',
    icon: HeartIcon,
  },
  {
    name: 'Diagnostic Medicine.',
    description: 'Our vets determine your pet’s medical condition using a variety of diagnostic tools we have available.',
    icon: HeartIcon,
  },
  {
    name: 'Therapy and Rehabilitation.',
    description: 'We have different programs to increase mobility, reduce pain and promote healing from surgery, injury or chronic conditions.',
    icon: HeartIcon,
  },
  {
    name: 'Preventive Care.',
    description: 'Prevention is the key to your pet’s health.',
    icon: HeartIcon,
  },
]

type HomeFeatureSectionProps = {
  children: React.ReactNode
}

const HomeFeatureSection: React.FC<HomeFeatureSectionProps> = ({children}) => {
    return (
        <div className="overflow-hidden bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              <div className="lg:pr-8 lg:pt-4">
                <div className="lg:max-w-lg">
                  <h1 className="text-base font-semibold leading-7 text-black-600">Your pets is our priority</h1>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600 sm:text-5xl">OUR SERVICES</p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                  Providing our patients with the most complete range of services and the highest quality in veterinary care has
                  always been our top priority at Abys Agrivet and Animal Clinic.
                  </p>
                  <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                    {features.map((feature) => (
                      <div key={feature.name} className="relative pl-9">
                        <dt className="inline font-semibold text-gray-900">
                          <feature.icon className="absolute top-1 left-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                          {feature.name}
                        </dt>{' '}
                        <dd className="inline">{feature.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
             {children}
            </div>
          </div>
        </div>
      )
}

export default HomeFeatureSection



