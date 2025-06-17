import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Building, User, Mail, CheckCircle, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { motion } from 'framer-motion';
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

const WaitlistForm = () => {
  // Define company size and industry options
  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1001+', label: '1000+ employees' },
  ];

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Other'
  ];

  const hearAboutOptions = [
    'Search Engine',
    'Social Media',
    'Friend/Colleague',
    'News Article',
    'Other'
  ];
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();
  
  // Define form variants for animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

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

      // Prepare the data for submission
      const formData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        company: data.company.trim(),
        role: data.role.trim(),
        companySize: data.companySize,
        industry: data.industry,
        currentTools: data.currentTools?.trim() || '',
        painPoints: data.painPoints.trim(),
        hearAbout: data.hearAbout,
        newsletter: Boolean(data.newsletter),
        terms: true // Already validated as true
      };

      // Call the API
      const response = await api.waitlist.register(formData);
      
      setUserPhone(data.phone);
      setUserEmail(data.email);
      setStep('otp');
      
      toast({
        title: "Verification Code Sent!",
        description: `We've sent a 6-digit code to ${data.email}`,
      });
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
      // Verify the OTP with the backend
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
      console.error('OTP verification error:', error);
      
      if (error.status === 400) {
        toast({
          title: "Invalid OTP",
          description: error.message || "Please enter the correct 6-digit code.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to verify OTP. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    toast({
      title: "OTP Resent!",
      description: `A new code has been sent to ${userPhone}`,
    });
  };

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const successVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  if (step === 'success') {
    return (
      <section id="waitlist" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        {/* Enhanced background animations */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-green-300/30 to-blue-300/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative"
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 20px rgba(34, 197, 94, 0)",
                  "0 0 0 0 rgba(34, 197, 94, 0)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity
                }
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              
              {/* Celebration sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                    repeatDelay: 2
                  }}
                />
              ))}
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              You're In! 🎉
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Welcome to the HireAI family! You'll be among the first to experience the future of recruitment.
            </motion.p>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
              whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              />
              
              <h3 className="font-semibold text-gray-900 mb-2 relative z-10">What's Next?</h3>
              <ul className="text-left space-y-2 text-gray-600 relative z-10">
                {[
                  "We'll notify you as soon as HireAI launches",
                  "You'll get exclusive early access",
                  "Special launch pricing just for you",
                  "Priority onboarding and support"
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced background animations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating form elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Join the HireAI Waitlist
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Be among the first to revolutionize your recruitment process with AI
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ y: -2 }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={phoneForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={phoneForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <div className="relative">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </motion.div>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input 
                                  placeholder="John Doe" 
                                  className="pl-10 transition-all duration-200 focus:shadow-md" 
                                  {...field} 
                                />
                              </motion.div>
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <div className="relative">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </motion.div>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input 
                                  type="email" 
                                  placeholder="john@company.com" 
                                  className="pl-10 transition-all duration-200 focus:shadow-md" 
                                  {...field} 
                                />
                              </motion.div>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />

                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={phoneForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <div className="relative">
                          <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input placeholder="Acme Corp" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={phoneForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <FormControl>
                          <Input placeholder="HR Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <motion.div variants={itemVariants}>
                  <div className="space-y-4">
                    <FormField
                      control={phoneForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the Terms of Service and Privacy Policy
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Join Waitlist'
                      )}
                    </Button>
                  </div>
                </motion.div>
              </motion.form>
            </Form>
          )}

          {step === 'otp' && (
            <Form {...otpForm}>
              <motion.form 
                onSubmit={otpForm.handleSubmit(onOTPSubmit)} 
                className="space-y-6 text-center relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Verify Your Phone Number
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We've sent a 6-digit code to{" "}
                    <motion.span
                      className="font-semibold text-blue-600"
                      animate={{ color: ["#2563eb", "#7c3aed", "#2563eb"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {userPhone}
                    </motion.span>
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Verification Code</FormLabel>
                        <FormControl>
                          <div className="flex justify-center">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                  {[...Array(6)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      whileFocus={{ scale: 1.1 }}
                                      animate={{
                                        borderColor: field.value.length > i ? ["#3b82f6", "#8b5cf6", "#3b82f6"] : "#e5e7eb"
                                      }}
                                      transition={{
                                        borderColor: { duration: 1, repeat: Infinity }
                                      }}
                                    >
                                      <InputOTPSlot index={i} />
                                    </motion.div>
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                            </motion.div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <div className="space-y-3">
                  <motion.div variants={itemVariants}>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                    >
                      {isSubmitting ? "Verifying..." : "Verify & Join Waitlist"}
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={resendOTP}
                      className="w-full text-blue-600 hover:text-blue-700"
                    >
                      Didn't receive the code? Resend
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setStep('phone')}
                      className="w-full text-gray-600 hover:text-gray-700"
                    >
                      Change Phone Number
                    </Button>
                  </motion.div>
                </div>

                <motion.p 
                  className="text-sm text-gray-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  For testing purposes, use code: <strong>123456</strong>
                </motion.p>
              </motion.form>
            </Form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistForm;
