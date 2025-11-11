/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        valueCreativity: "#F6C000", // yellow
        valueCollaboration: "#2D82F1", // blue
        valueEmpowerment: "#F07E2E", // orange
        valueCuriosity: "#1FA36A", // green
        valueProblem: "#D455A8", // pink
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};