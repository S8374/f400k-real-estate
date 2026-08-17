'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    CreditCard, 
    CircleCheckBig, 
    DollarSign, 
    CheckCircle2, 
    AlertCircle, 
    Award, 
    Lock, 
    Calendar, 
    Sparkles, 
    Shield 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ProgressIndicator } from '@radix-ui/react-progress';
import { offPlanMilestones } from '@/data/propertyData';
import { FaDollarSign } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PreviewPaymentPlansProps {
    previewData: any;
}

export const PreviewPaymentPlans = ({ previewData }: PreviewPaymentPlansProps) => {
    return (
        <Card className="bg-stone-900/60 border-white/10 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-b from-emerald-500 to-emerald-900 rounded-full flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl">Payment Plan & Milestones</h2>
            </div>

            {/* Ready to Move / Off-Plan  */}
            <Tabs defaultValue="ready" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-stone-800/50 h-14 rounded p-1">
                    <TabsTrigger value="ready" className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded">
                        <CircleCheckBig className="w-5 h-5 mr-2" />
                        Ready to Move
                    </TabsTrigger>
                    <TabsTrigger value="offplan" className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded">
                        Off-Plan
                    </TabsTrigger>
                </TabsList>

                {/* Ready to Move Content*/}
                <TabsContent value="ready" className="mt-6">
                    <Card className="bg-emerald-800/10 border-emerald-800/30 p-6">
                        <div className="flex items-start gap-4">
                            <CircleCheckBig className="w-8 h-8 text-emerald-500 mt-1" />
                            <div>
                                <p className="font-medium">Property Ready for Immediate Move-In</p>
                                <p className="text-sm text-gray-400 mt-1">Full payment or bank financing options available</p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Off-Plan Content */}
                <TabsContent value="offplan" className="mt-6 space-y-6">
                    <Card className="bg-emerald-800/10 border-emerald-800/30 p-6">
                        <div className="flex items-start gap-4">
                            <CircleCheckBig className="w-8 h-8 text-emerald-500 mt-1" />
                            <div>
                                <p className="font-medium">Property Ready for Immediate Move-In</p>
                                <p className="text-sm text-gray-400 mt-1">Full payment or bank financing options available</p>
                            </div>
                        </div>
                    </Card>
                    {/*Payment Progress*/}
                    <Card className="bg-neutral-900/70 border border-white/5 rounded shadow-xl">
                        <CardHeader className="">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-yellow-500/20 rounded-full flex items-center justify-center shadow-md">
                                    <CreditCard className="w-5 h-5 text-yellow-400" />
                                </div>
                                <CardTitle className="text-lg">Payment Distribution</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                {/* Payment Progress title + amount */}
                                <div className="flex justify-between items-baseline">
                                    <p className="text-base text-gray-300">Payment Progress</p>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Total Paid </p>
                                        <p className="text-yellow-400 text-xl font-bold">SAR 1,200,000
                                            <span className="text-sm text-gray-400">/SAR 4,000,000 </span>
                                        </p>
                                    </div>
                                </div>
                                <Progress value={20} className="h-4.5 bg-green-200/50 rounded-full overflow-hidden">
                                    <div className="h-full w-full flex items-center justify-start">
                                        <div className="h-full w-[20%] bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-full relative flex items-center justify-center">
                                            <span className="text-green-900 font-bold absolute">20%</span>
                                        </div>
                                    </div>
                                    <ProgressIndicator
                                        className="absolute left-[20%] -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-neutral-900"
                                        style={{ transition: 'left 0.4s ease' }}
                                    >
                                        <div className="w-7 h-7 bg-emerald-500 rounded-full"></div>
                                    </ProgressIndicator>
                                </Progress>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Off-Plan Payment Schedule*/}
                    <Card className="bg-stone-900/60 border-white/10 rounded shadow-2xl overflow-hidden">
                        <CardHeader className="px-3">
                            <CardTitle className="text-xl font-normal">Off-Plan Payment Schedule</CardTitle>
                        </CardHeader>

                        <CardContent className="px-2 pb-1 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Total Price */}
                                <Card className="bg-stone-900 border-white/10 rounded p-4">
                                    <CardContent className="p-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-emerald-800" />
                                            <p className="text-xs text-white">Total Price</p>
                                        </div>
                                        <p className="text-lg font-normal text-white">SAR 4,200,000</p>
                                    </CardContent>
                                </Card>

                                {/* Verified Payments */}
                                <Card className="bg-emerald-800/10 border-emerald-800/30 rounded p-4">
                                    <CardContent className="p-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                                            <p className="text-xs text-white">Verified Payments</p>
                                        </div>
                                        <p className="text-xl font-normal text-emerald-800">0 / 7</p>
                                    </CardContent>
                                </Card>

                                {/* Pending Review */}
                                <Card className="bg-yellow-400/10 border-yellow-400 rounded p-4">
                                    <CardContent className="p-0 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                                            <p className="text-xs text-white">Pending Review</p>
                                        </div>
                                        <p className="text-xl font-normal text-yellow-400">1</p>
                                    </CardContent>
                                </Card>

                                {/* Construction Progress */}
                                <Card className="bg-stone-900 border-white/10 rounded p-4">
                                    <CardContent className="p-0 space-y-2">
                                        <div className="w-full h-4 sm:h-6 rounded-full mb-1">
                                            <Progress
                                                value={10}
                                                className="h-full"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={'/property-svg.svg'}
                                                alt='property'
                                                height={20}
                                                width={20}
                                            />
                                            <p className="text-xs text-white">Construction Progress</p>
                                        </div>
                                        <p className="text-xl font-normal text-white">10%</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Payment Progress + 0% Complete with shadcn Progress */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-400">Payment Progress</p>
                                    <p className="text-base text-white">0%</p>
                                </div>

                                <div className="h-12 bg-transparent border border-white/10 rounded overflow-hidden relative flex items-center justify-center gap-x-2">
                                    <Award />
                                    <p className="text-lg font-normal text-white"> 0% Complete</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="rounded space-y-4">
                        {/* Milestones */}
                        <div className="space-y-4">
                            {offPlanMilestones.map((milestone) => (
                                <Card
                                    key={milestone.step}
                                    className={`bg-stone-900/70 border 
                                        ${milestone.active ? 'border-yellow-500/50' : 'border-white/10'} rounded p-6 
                                        ${milestone.active ? '' : 'opacity-70'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 relative">
                                            <div className="flex items-start gap-6 relative pl-2">
                                                {/* Circle with number / icon */}
                                                <div className="relative shrink-0">
                                                    {milestone.active ? (
                                                        <>
                                                            {/* glowing circle + exclamation icon */}
                                                            <div className={` w-12 h-12 rounded-full flex items-center justify-center ${milestone.active ? "w-8 h-8 relative bg-yellow-300 rounded-full shadow-2xl overflow-hidden" : 'bg-linear-to-br from-white/30 to-black/0'}`}>
                                                                <AlertCircle className="w-7 h-7 text-black" />
                                                            </div>
                                                            {/* Small number badge bottom-right */}
                                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                                                <span className="text-white text-sm font-bold">{milestone.step}</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/*lock icon */}
                                                            <div className="w-14 h-14 bg-linear-to-br from-white/30 to-black/0 rounded-full flex items-center justify-center relative">
                                                                <Lock className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            {/* Small number badge bottom-right */}
                                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black rounded-full shadow-2xl border border-gray-700 flex items-center justify-center">
                                                                <span className="text-gray-400 text-sm font-bold">{milestone.step}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-lg">{milestone.title}</h4>
                                                    <p className="text-sm text-gray-400 mt-1">{milestone.desc}</p>
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                                        <div className=' border py-2 pl-2 rounded bg-[#12121266]'>
                                                            <p className="text-sm text-gray-400 flex items-center gap-x-1"> <span className='text-xs'><FaDollarSign /></span> Amount</p>
                                                            <p className=" text-white">{milestone.amount}</p>
                                                        </div>
                                                        <div className=' border py-2 px-2 rounded bg-[#12121266]'>
                                                            <p className="text-sm text-gray-500">Construction</p>
                                                            <p className="font-bold text-emerald-400">{milestone.construction}</p>
                                                        </div>
                                                        <div className=' border py-2 px-4 rounded bg-[#12121266] '>
                                                            <p className="text-sm text-gray-500">Due Date</p>
                                                            <p className="font-bold flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                {milestone.dueDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {milestone.actionRequired && (
                                            <Badge className="bg-yellow-700/20 border border-yellow-700/40 text-yellow-500 px-4 py-2 rounded-full flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Action Required
                                            </Badge>
                                        )}
                                        {!milestone.active && milestone.step > 1 && (
                                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                                <Lock className="w-4 h-4 mr-1" />
                                                Locked
                                            </Badge>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* REGA Verified Footer */}
                        <div className="border p-4 rounded border-white/10 flex items-center gap-3">
                            <div className='bg-emerald-700/30 p-2 rounded-full'>
                                <Shield className="w-6 h-6 text-emerald-700" />
                            </div>
                            <div>
                                <p className="text-sm">REGA Verified Payment Plan</p>
                                <p className='text-xs text-gray-400'>All milestones monitored by Saudi Real Estate General Authority</p>
                            </div>
                        </div>

                        <Button className="w-full  bg-emerald-700 hover:bg-emerald-800 h-14 text-lg rounded shadow-lg">
                            <CircleCheckBig className="" />
                            Accept this Payment Plan & Proceed
                        </Button>

                        <p className="text-center text-xs text-gray-500">
                            All transactions protected by Saudi Real Estate Authority (REGA) laws
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    );
};
