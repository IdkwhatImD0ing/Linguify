// 'use client'

// import { X } from 'lucide-react'
// import Image from 'next/image'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts"

// const chartData = [
//   { skill: "Grammar", value: 80 },
//   { skill: "Listening", value: 70 },
//   { skill: "Speaking", value: 60 },
//   { skill: "Vocabulary", value: 75 },
//   { skill: "Pronunciation", value: 65 },
// ]

// export default function ActionReport() {
//   return (
//     <Card className="w-full max-w-md mx-auto bg-white">
//       <CardHeader className="flex justify-between items-center border-b pb-4">
//         <CardTitle className="text-[#385664] text-xl">Action Report</CardTitle>
//         <Button variant="ghost" size="icon">
//           <X className="h-5 w-5 text-[#385664]" />
//         </Button>
//       </CardHeader>
//       <CardContent className="space-y-6 pt-6">
//         <div className="rounded-lg overflow-hidden">
//           <Image
//             src="/placeholder.svg?height=200&width=400"
//             width={400}
//             height={200}
//             alt="Coffee cups"
//             className="w-full object-cover"
//           />
//         </div>
//         <div className="bg-[#e8f4ea] p-4 rounded-lg">
//           <h3 className="font-semibold mb-2 text-[#385664]">Statistic</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <RadarChart data={chartData}>
//               <PolarGrid stroke="#385664" />
//               <PolarAngleAxis dataKey="skill" tick={{ fill: '#385664' }} />
//               <Radar
//                 name="Skill Level"
//                 dataKey="value"
//                 stroke="#4299e1"
//                 fill="#4299e1"
//                 fillOpacity={0.6}
//               />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//         <div>
//           <h3 className="font-semibold mb-2 text-[#385664]">Learn More</h3>
//           <div className="grid grid-cols-3 gap-2">
//             <Button variant="outline" className="bg-[#4299e1] text-white hover:bg-[#3182ce]">Grammar</Button>
//             <Button variant="outline" className="bg-[#4299e1] text-white hover:bg-[#3182ce]">Listening</Button>
//             <Button variant="outline" className="bg-[#4299e1] text-white hover:bg-[#3182ce]">Speaking</Button>
//             <Button variant="outline" className="bg-[#4299e1] text-white hover:bg-[#3182ce]">Vocabulary</Button>
//             <Button variant="outline" className="bg-[#4299e1] text-white hover:bg-[#3182ce]">Pronunciation</Button>
//           </div>
//         </div>
//         <Button className="w-full bg-white text-[#385664] border border-[#385664] hover:bg-[#385664] hover:text-white">
//           View Placement Rank
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }