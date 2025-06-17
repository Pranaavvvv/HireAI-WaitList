import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Building, User, Mail, CheckCircle, ArrowLeft, Users, Briefcase, MapPin, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { api } from '@/utils/apiClient';

const phoneSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(1, 'Please select industry'),
  currentTools: z.string().optional(),
  painPoints: z.string().min(10, 'Please describe your main challenges (minimum 10 characters)'),
  hearAbout: z.string().min(1, 'Please tell us how you heard about us'),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OTPFormValues = z.infer<typeof otpSchema>;

const Waitlist = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      role: '',
      companySize: '',
      industry: '',
      currentTools: '',
      painPoints: '',
      hearAbout: '',
      newsletter: false,
      terms: false,
    }
  });

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    }
  });

  const onPhoneSubmit = async (data: PhoneFormValues) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'company',
        'role', 'companySize', 'industry', 'painPoints', 'hearAbout', 'terms'
      ];

      const missingFields = requiredFields.filter(field => !data[field as keyof PhoneFormValues]);
      if (missingFields.length > 0) {
        missingFields.forEach(field => {
          phoneForm.setError(field as any, {
            type: 'manual',
            message: 'This field is required'
          });
        });
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Log the form data in detail
      console.log('Form data before submission:', {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        company: data.company?.trim(),
        role: data.role?.trim(),
        companySize: data.companySize?.trim(),
        industry: data.industry?.trim(),
        currentTools: data.currentTools?.trim() || '',
        painPoints: data.painPoints?.trim(),
        hearAbout: data.hearAbout?.trim(),
        newsletter: Boolean(data.newsletter),
        terms: Boolean(data.terms)
      });

      const response = await api.waitlist.register(data);
      
      toast({
        title: "Success!",
        description: "You have successfully joined the waitlist!",
      });
      phoneForm.reset();
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Handle validation errors
      if (error.status === 400) {
        try {
          const validationErrors = JSON.parse(error.message);
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: { field: string; message: string }) => {
              phoneForm.setError(err.field as any, {
                type: 'manual',
                message: err.message
              });
            });
          } else {
            Object.entries(validationErrors).forEach(([field, message]) => {
              phoneForm.setError(field as any, {
                type: 'manual',
                message: message as string
              });
            });
          }
          
          toast({
            title: "Validation Error",
            description: "Please check the form for errors.",
            variant: "destructive"
          });
        } catch (e) {
          // If parsing fails, show the raw error message
          toast({
            title: "Error",
            description: error.message || "Failed to register. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to register. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOTPSubmit = async (data: OTPFormValues) => {
    setIsSubmitting(true);
    try {
      await api.waitlist.verify({
        email: userEmail,
        code: data.otp
      });
      
      setStep('success');
      toast({
        title: "Welcome to HireAI!",
        description: "You've been successfully added to our waitlist.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.waitlist.resendVerification({
        email: userEmail
      });
      
      toast({
        title: "Code Resent!",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <SEO 
          title="Welcome to HireAI Waitlist - Registration Successful"
          description="Thank you for joining the HireAI waitlist. You'll be among the first to access our revolutionary AI recruitment platform."
        />
        
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 30px rgba(34, 197, 94, 0)",
                  "0 0 0 0 rgba(34, 197, 94, 0)"
                ]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              You're All Set! 🎉
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              variants={itemVariants}
            >
              Thank you for joining the HireAI waitlist! We'll notify you at{" "}
              <span className="font-semibold text-blue-600">{userEmail}</span> when we launch.
            </motion.p>

            <motion.div className="space-y-4 mb-8" variants={itemVariants}>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
                <ul className="text-left space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                    Early access notification when HireAI launches
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                    Exclusive launch pricing and special offers
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                    Priority onboarding and dedicated support
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <SEO 
        title="Join HireAI Waitlist - Revolutionary AI Recruitment Platform"
        description="Sign up for early access to HireAI, the AI-powered recruitment platform that will transform how you hire talent."
      />
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-52 h-52 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full"
          animate={{
            scale: [1, 0.7, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join the HireAI Revolution
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be among the first to experience the future of AI-powered recruitment. 
              Get exclusive early access and special launch pricing.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {step === 'phone' && (
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <FormControl>
                                <Input placeholder="John" className="pl-10 h-12" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <FormControl>
                                <Input placeholder="Doe" className="pl-10 h-12" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <FormControl>
                                <Input type="email" placeholder="john@company.com" className="pl-10 h-12" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" className="pl-10 h-12" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <div className="relative">
                              <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <FormControl>
                                <Input placeholder="Acme Corp" className="pl-10 h-12" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Role</FormLabel>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <FormControl>
                                <Input placeholder="HR Manager" className="pl-10 h-12" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                                <SelectItem value="1000+">1000+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="consulting">Consulting</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={phoneForm.control}
                      name="currentTools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Recruitment Tools (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., LinkedIn Recruiter, Workday, Greenhouse" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={phoneForm.control}
                      name="painPoints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are your biggest recruitment challenges?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your current recruitment challenges, what takes the most time, or what you'd like to automate..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={phoneForm.control}
                      name="hearAbout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How did you hear about HireAI?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select how you heard about us" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="google">Google Search</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                              <SelectItem value="blog">Blog/Article</SelectItem>
                              <SelectItem value="event">Conference/Event</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <div className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Subscribe to our newsletter for recruitment tips and AI insights
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={phoneForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the Terms of Service and Privacy Policy *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg"
                    >
                      {isSubmitting ? "Sending Verification Code..." : "Join Waitlist"}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            )}

            {step === 'otp' && (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-8 text-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Verify Your Phone Number
                    </h3>
                    <p className="text-gray-600 mb-8">
                      We've sent a 6-digit verification code to{" "}
                      <span className="font-semibold text-blue-600">{userPhone}</span>
                    </p>
                  </div>

                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Verification Code</FormLabel>
                        <FormControl>
                          <div className="flex justify-center">
                            <InputOTP maxLength={6} {...field}>
                              <InputOTPGroup>
                                {[...Array(6)].map((_, i) => (
                                  <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
                                ))}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg"
                    >
                      {isSubmitting ? "Verifying..." : "Complete Registration"}
                    </Button>

                    <div className="space-y-2">
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={handleResendCode}
                        className="w-full text-blue-600 hover:text-blue-700"
                      >
                        Resend Code
                      </Button>

                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => setStep('phone')}
                        className="w-full text-gray-600 hover:text-gray-700"
                      >
                        Change Phone Number
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                    For testing purposes, use code: <strong>123456</strong>
                  </p>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
