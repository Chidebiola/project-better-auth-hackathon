export function BountyBadge({ amount }: { amount: number }) {
  if (amount <= 0) return null

  return (
    <span className="bg-primary-3 text-primary-11 text-12 font-600 rounded-6 inline-flex items-center px-8 py-2">
      ${amount}
    </span>
  )
}
