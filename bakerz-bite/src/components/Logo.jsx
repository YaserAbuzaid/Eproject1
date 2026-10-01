/** The Bakerz Bite mark: a wheat sheaf rising out of a cupcake case. */
export default function Logo({ className = 'bb-logo__mark' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Bakerz Bite logo"
    >
      <circle cx="32" cy="32" r="31" fill="#3b2416" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="#e8a94b" strokeWidth="1.4" />

      {/* wheat stalk */}
      <path d="M32 13v22" stroke="#e8a94b" strokeWidth="2.2" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse
            cx="26.5"
            cy={19 + i * 6}
            rx="5"
            ry="2.7"
            fill="#c07a33"
            transform={`rotate(-28 26.5 ${19 + i * 6})`}
          />
          <ellipse
            cx="37.5"
            cy={19 + i * 6}
            rx="5"
            ry="2.7"
            fill="#c07a33"
            transform={`rotate(28 37.5 ${19 + i * 6})`}
          />
        </g>
      ))}

      {/* cupcake case */}
      <path
        d="M19 38h26l-3.4 12.4a3 3 0 0 1-2.9 2.2H25.3a3 3 0 0 1-2.9-2.2Z"
        fill="#fff7ec"
      />
      <path d="M19 38h26" stroke="#c07a33" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M26 40.5v10M32 40.5v10M38 40.5v10"
        stroke="#f3e2d0"
        strokeWidth="1.3"
      />
    </svg>
  );
}
