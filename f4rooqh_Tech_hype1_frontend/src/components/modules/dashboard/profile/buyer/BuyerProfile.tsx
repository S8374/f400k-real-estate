"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Mail, Lock, Trophy, Edit, FileText, LandPlot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import BuyerProfileOverview from "./BuyerProfileOverView";
import BuyerProfileContactInfo from "./BuyerProfileContactInfo";
import BuyerProfileSecurity from "./BuyerProfileSecurity";
import BuyerProfileProperty from "./BuyerProfileProperty";
import { Button } from "@/components/ui/button";
import BuyerProfileKYCDocuments from "./BuyerProfileKYCDocuments";
import BuyerProfileHeader from "./BuyerProfileHeader";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetGoldenVisaProgressQuery } from "@/redux/api/mileston.api";
import { useRef, useState } from "react";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import BuyerEditProfileModal from "./BuyerEditProfileModal";
import BuyerContactEditModal from "./BuyerContactEditModal";

export default function BuyerProfile() {
    const { data: userData } = useGetMeQuery({})
    const user = userData?.data?.data || userData?.data || userData;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isContactEditModalOpen, setIsContactEditModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadImages, { isLoading: isUploadingImage }] = useUploadImagesMutation();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const { data: goldenVisaDataResponse } = useGetGoldenVisaProgressQuery(undefined, { skip: !user?.id });
    const goldenVisaProgress = Math.max(0, Math.min(100, Number(goldenVisaDataResponse?.totalProgress || 0)));
    
    console.log("user",user)
    const handleImageUpload = async (selectedFile: File) => {
        try {
            const imageFormData = new FormData();
            imageFormData.append("files", selectedFile);

            const uploadResponse = await uploadImages(imageFormData).unwrap();
            const uploadedUrl =
                uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

            if (!uploadedUrl) {
                toast.error("Failed to get uploaded image URL");
                return;
            }

            const profileResponse = await updateProfile({ avatarUrl: uploadedUrl }).unwrap();

            if (profileResponse?.success) {
                toast.success(profileResponse?.message || "Photo updated successfully!");
            } else {
                toast.error(profileResponse?.message || "Failed to update profile photo");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to upload photo");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        handleImageUpload(file);
        e.target.value = "";
    };

    const isImageUpdating = isUploadingImage || isUpdatingProfile;
    return (
        <div className="px-2 sm:px-4">
            <h1 className="text-xl font-semibold">My Profile</h1>
            <p className="text-sm text-gray-300 mb-6">Professional agent profile & verification</p>

            <Tabs defaultValue="overview" className="flex flex-col lg:grid lg:grid-cols-6 gap-6">
                {/* Sidebar – horizontal scroll on mobile, fixed-width column on sm+ */}
                <TabsList
                    className="
                        flex flex-row lg:flex-col
                        bg-[#2c2a2a]
                        p-1.5
                        rounded
                        overflow-x-auto
                        w-full lg:w-56 lg:min-w-56
                        h-auto
                        shadow-sm
                        gap-1.5
                        shrink-0
                        self-start
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                    "
                >
                    <TabsTrigger
                        value="overview"
                        className="
                            flex-1 lg:flex-none
                            lg:w-full
                            justify-center lg:justify-start
                            items-center
                            gap-2.5
                            px-4 py-2.5
                            rounded
                            text-sm font-medium
                            whitespace-nowrap
                            data-[state=inactive]:text-gray-400
                            data-[state=active]:bg-emerald-600
                            data-[state=active]:text-white
                            data-[state=active]:shadow-sm
                            hover:bg-white/5
                            transition-all
                        "
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        <span>Overview</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="kyc_documents"
                        className="
                            flex-1 lg:flex-none
                            lg:w-full
                            justify-center lg:justify-start
                            items-center
                            gap-2.5
                            px-4 py-2.5
                            rounded
                            text-sm font-medium
                            whitespace-nowrap
                            data-[state=inactive]:text-gray-400
                            data-[state=active]:bg-emerald-600
                            data-[state=active]:text-white
                            data-[state=active]:shadow-sm
                            hover:bg-white/5
                            transition-all
                        "
                    >
                        <FileText size={18} className="shrink-0" />
                        <span>KYC</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="contact"
                        className="
                            flex-1 lg:flex-none
                            lg:w-full
                            justify-center lg:justify-start
                            items-center
                            gap-2.5
                            px-4 py-2.5
                            rounded
                            text-sm font-medium
                            whitespace-nowrap
                            data-[state=inactive]:text-gray-400
                            data-[state=active]:bg-emerald-600
                            data-[state=active]:text-white
                            data-[state=active]:shadow-sm
                            hover:bg-white/5
                            transition-all
                        "
                    >
                        <Mail size={18} className="shrink-0" />
                        <span>Contact Info</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="property"
                        className="
                            flex-1 lg:flex-none
                            lg:w-full
                            justify-center lg:justify-start
                            items-center
                            gap-2.5
                            px-4 py-2.5
                            rounded
                            text-sm font-medium
                            whitespace-nowrap
                            data-[state=inactive]:text-gray-400
                            data-[state=active]:bg-emerald-600
                            data-[state=active]:text-white
                            data-[state=active]:shadow-sm
                            hover:bg-white/5
                            transition-all
                        "
                    >
                        <LandPlot size={18} className="shrink-0" />
                        <span>Property</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="security"
                        className="
                            flex-1 lg:flex-none
                            lg:w-full
                            justify-center lg:justify-start
                            items-center
                            gap-2.5
                            px-4 py-2.5
                            rounded
                            text-sm font-medium
                            whitespace-nowrap
                            data-[state=inactive]:text-gray-400
                            data-[state=active]:bg-emerald-600
                            data-[state=active]:text-white
                            data-[state=active]:shadow-sm
                            hover:bg-white/5
                            transition-all
                        "
                    >
                        <Lock size={18} className="shrink-0" />
                        <span>Security</span>
                    </TabsTrigger>
                </TabsList>

                {/* Main content area */}
                <div className="lg:col-span-5 w-full">
                    {/* Profile Header – always visible */}
                    <BuyerProfileHeader
                        user={user}
                        isImageUpdating={isImageUpdating}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        goldenVisaProgress={goldenVisaProgress}
                        onEditProfile={() => setIsEditModalOpen(true)}
                    />

                    {/* Tab contents */}
                    <TabsContent value="overview" className="mt-6">
                        <BuyerProfileOverview
                            user={user}
                            onEditContact={() => setIsContactEditModalOpen(true)}
                        />
                    </TabsContent>
                    <TabsContent value="kyc_documents" className="mt-6">
                        <BuyerProfileKYCDocuments />
                    </TabsContent>
                    <TabsContent value="contact" className="mt-6">
                        <BuyerProfileContactInfo
                            user={user}
                            onEditContact={() => setIsContactEditModalOpen(true)}
                        />
                    </TabsContent>
                    <TabsContent value="security" className="mt-6">
                        <BuyerProfileSecurity />
                    </TabsContent>
                    <TabsContent value="property" className="mt-6">
                        <BuyerProfileProperty />
                    </TabsContent>
                </div>
            </Tabs>

            <BuyerEditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />

            <BuyerContactEditModal
                isOpen={isContactEditModalOpen}
                onClose={() => setIsContactEditModalOpen(false)}
                user={user}
            />
        </div>
    );
}