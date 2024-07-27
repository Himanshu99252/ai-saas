// "use client";

// import * as z from "zod";
// import { MessageSquare } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { BotAvatar } from "@/components/bot-avatar";
// import { Heading } from "@/components/heading";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { cn } from "@/lib/utils";
// import { Loader } from "@/components/loader";
// import { UserAvatar } from "@/components/user-avatar";
// import { Empty } from "@/components/ui/empty";
// import { useProModal } from "@/hooks/use-pro-modal";
// import { chatSession } from "@/app/api/conversation/route";

// const formSchema = z.object({
//   prompt: z.string().min(1, "This field is required"),
// });

// const ConversationPage = () => {
//   const router = useRouter();
//   const proModal = useProModal();
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       prompt: "",
//     },
//   });

//   const isLoading = form.formState.isSubmitting;

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     const userInput = values.prompt;
//     console.log("User input:", userInput);
  
//     try {
//       const userInput1="give me about this"+userInput+""
//       const response = await chatSession.sendMessage(userInput1);
//       const mainContent = response.response.candidates[0].content.parts[0].text;
//       console.log("Main Content:", mainContent);
//       console.log(response)
//       const mockJsonResp = (await response.response.text())
//       console.log(JSON.parse(mockJsonResp));
//       if (!response.ok) {
//         throw new Error("Failed to fetch response");
//       }
  
//       const data = await response.json();
//       const message = data.message;
  
//       if (message) {
//         setMessages(prevMessages => [...prevMessages, 
//           { role: "user", content: userInput }, 
//           { role: "bot", content: message }
//         ]);
//         form.reset();  
//       } else {
//         toast.error("No response message received.");
//       }
//     } catch (error) {
//       console.error("Error during request:", error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <Heading
//         title="Conversation"
//         description="Our most advanced conversation model."
//         icon={MessageSquare}
//         iconColor="text-violet-500"
//         bgColor="bg-violet-500/10"
//       />
//       <div className="px-4 lg:px-8">
//         <div>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="
//                 rounded-lg 
//                 border 
//                 w-full 
//                 p-4 
//                 px-3 
//                 md:px-6 
//                 focus-within:shadow-sm
//                 grid
//                 grid-cols-12
//                 gap-2
//               "
//             >
//               <FormField
//                 name="prompt"
//                 render={({ field }) => (
//                   <FormItem className="col-span-12 lg:col-span-10">
//                     <FormControl className="m-0 p-0">
//                       <Input
//                         className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
//                         disabled={isLoading}
//                         placeholder="Enter your message"
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 className="col-span-12 lg:col-span-2 w-full"
//                 type="submit"
//                 disabled={isLoading}
//                 size="icon"
//               >
//                 Send
//               </Button>
//             </form>
//           </Form>
//         </div>
//         <div className="space-y-4 mt-4">
//           {isLoading && (
//             <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
//               <Loader />
//             </div>
//           )}
//           {messages.length === 0 && !isLoading && (
//             <Empty label="No conversation started." />
//           )}
//           <div className="flex flex-col-reverse gap-y-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={cn(
//                   "p-8 w-full flex items-start gap-x-8 rounded-lg",
//                   message.role === "user"
//                     ? "bg-white border border-black/10"
//                     : "bg-muted"
//                 )}
//               >
//                 {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                 <p className="text-sm">{message.content}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConversationPage;

"use client";

import * as z from "zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { chatSession } from "@/app/api/conversation/route";

const formSchema = z.object({
  prompt: z.string().min(1, "This field is required"),
});

const ConversationPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const userInput = values.prompt;
    console.log("User input:", userInput);
  
    try {
      // Construct the prompt
      const userInput1 = `give me about this ${userInput}`;
      console.log("Constructed Prompt:", userInput1);
  
      // Send the message
      const response = await chatSession.sendMessage(userInput1);
  
      // Since response is already in JSON format, directly use it
      const responseJson = response; // Assuming `response` is the JSON object
      console.log("Response JSON:", responseJson);
  
      // Extract main content
      const mainContent = responseJson.response.candidates[0].content.parts[0].text;
      console.log("Main Content:", mainContent);
  
      // Check if response is valid
      if (!responseJson || !responseJson.response) {
        throw new Error("Failed to fetch response");
      }
  
      // Update UI
      if (mainContent) {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "user", content: userInput },
          { role: "bot", content: mainContent }
        ]);
        form.reset();
      } else {
        toast.error("No response message received.");
      }
    } catch (error) {
      console.error("Error during request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  


  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter your message"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Send
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
