interface IdealForProps {
  idealFor: string[]
}

export default function IdealFor({ idealFor }: IdealForProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Ideal for:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {idealFor.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <p className="text-gray-900 text-lg">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

