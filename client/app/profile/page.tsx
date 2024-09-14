// import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
// import { Button } from "../../components/ui/button";
// import { Progress } from "../../components/ui/progress";
// import { Badge } from "../../components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
// import { Settings, LogOut, Book, Award, Activity } from "lucide-react"

// export default function ProfilePage() {
//     return (
//         <div className="min-h-screen bg-gray-100">
//         <header className="bg-white shadow">
//             <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//             <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
//             <div className="flex space-x-2">
//                 <Button variant="outline" size="icon">
//                 <Settings className="h-4 w-4" />
//                 </Button>
//                 <Button variant="outline" size="icon">
//                 <LogOut className="h-4 w-4" />
//                 </Button>
//             </div>
//             </div>
//         </header>

//         <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//             <div className="px-4 py-6 sm:px-0">
//             <div className="flex flex-col md:flex-row gap-6">
//                 <div className="md:w-1/3">
//                 <Card>
//                     <CardContent className="pt-6">
//                     <div className="flex flex-col items-center">
//                         <Avatar className="w-24 h-24">
//                         <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//                         <AvatarFallback>JD</AvatarFallback>
//                         </Avatar>
//                         <h2 className="mt-4 text-2xl font-bold">John Doe</h2>
//                         <p className="text-muted-foreground">Joined January 2023</p>
//                         <div className="mt-4 flex space-x-2">
//                         <Badge>English</Badge>
//                         <Badge>Spanish</Badge>
//                         <Badge>French</Badge>
//                         </div>
//                     </div>
//                     </CardContent>
//                 </Card>
//                 </div>

//                 <div className="md:w-2/3 space-y-6">
//                 <Card>
//                     <CardHeader>
//                     <CardTitle>Language Progress</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                     <div className="space-y-4">
//                         <div>
//                         <div className="flex justify-between mb-1">
//                             <span className="text-sm font-medium">Spanish</span>
//                             <span className="text-sm font-medium">60%</span>
//                         </div>
//                         <Progress value={60} className="w-full" />
//                         </div>
//                         <div>
//                         <div className="flex justify-between mb-1">
//                             <span className="text-sm font-medium">French</span>
//                             <span className="text-sm font-medium">35%</span>
//                         </div>
//                         <Progress value={35} className="w-full" />
//                         </div>
//                         <div>
//                         <div className="flex justify-between mb-1">
//                             <span className="text-sm font-medium">German</span>
//                             <span className="text-sm font-medium">10%</span>
//                         </div>
//                         <Progress value={10} className="w-full" />
//                         </div>
//                     </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                     <CardTitle>Recent Activity</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                     <ul className="space-y-4">
//                         <li className="flex items-center">
//                         <Book className="h-5 w-5 mr-3 text-blue-500" />
//                         <div>
//                             <p className="text-sm font-medium">Completed Spanish Lesson 5</p>
//                             <p className="text-xs text-muted-foreground">2 hours ago</p>
//                         </div>
//                         </li>
//                         <li className="flex items-center">
//                         <Award className="h-5 w-5 mr-3 text-yellow-500" />
//                         <div>
//                             <p className="text-sm font-medium">Earned "Early Bird" badge</p>
//                             <p className="text-xs text-muted-foreground">Yesterday</p>
//                         </div>
//                         </li>
//                         <li className="flex items-center">
//                         <Activity className="h-5 w-5 mr-3 text-green-500" />
//                         <div>
//                             <p className="text-sm font-medium">7-day streak achieved!</p>
//                             <p className="text-xs text-muted-foreground">3 days ago</p>
//                         </div>
//                         </li>
//                     </ul>
//                     </CardContent>
//                 </Card>
//                 </div>
//             </div>
//             </div>
//         </main>
//         </div>
//     )
// }