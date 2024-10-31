import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook, getBookById } from "@/http/api";
import { useEffect, useState } from "react";

// Helper function to create a FileList from an array of files
const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
};

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    authorName: z.string().min(2, {
        message: 'Author Name must be at least 2 characters.',
    }),
    genre: z.string().min(2, {
        message: 'Genre must be at least 2 characters.',
    }),
    description: z.string().min(2, {
        message: 'Description must be at least 2 characters.',
    }),
    coverImage: z.instanceof(FileList).refine((file) => {
        return file.length === 0 || file.length === 1; // Handle no file or single file
    }, 'Cover Image is required'),
    file: z.instanceof(FileList).refine((file) => {
        return file.length === 0 || file.length === 1; // Handle no file or single file
    }, 'Book PDF is required'),
});

function CreateBook() {
    const { bookId } = useParams();  // Extract the ID from the URL
    console.log(bookId,"ID for bookId");
    
    const navigate = useNavigate();
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
   
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            genre: '',
            description: '',
            authorName:'',
            coverImage: undefined,
            file: undefined
        },
    });
    const { reset, handleSubmit, register, setValue, getValues } = form;

    const coverImageRef = register('coverImage');
    const fileRef = register('file');

    const queryClient = useQueryClient();

    const fetchBook = useMutation({
        mutationFn: () => getBookById(bookId),
        onSuccess: (data) => {
            console.log(data, "Eidrrr");
            
            reset({
                title: data.data.book.title,
                genre: data.data.book.genre,
                description: data.data.book.description,
                authorName: data.data.book.authorName,
                coverImage: undefined, // Use undefined here
                file: undefined // Use undefined here
            });

            if (data.data.book.coverImage) {
                setCoverImagePreview(data.data.book.coverImage);
            }
            if (data.data.book.file) {
                setFilePreview(data.data.book.file);
            }
        },
    });

    const mutation = useMutation({
        mutationFn: createBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            console.log('Book created successfully');
            navigate('/dashboard/books');
        },
    });

    useEffect(() => {
        if (bookId) {
            fetchBook.mutate();
        }
    }, [bookId]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formdata = new FormData();
        formdata.append('title', values.title);
        formdata.append('genre', values.genre);
        formdata.append('authorName', values.authorName);
        formdata.append('description', values.description);
        if (values.coverImage && values.coverImage[0]) formdata.append('coverImage', values.coverImage[0]);
        if (values.file && values.file[0]) formdata.append('file', values.file[0]);
        mutation.mutate(formdata);

        console.log(values);
    }

    const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            setValue('coverImage', createFileList([file]));
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            setValue('file', createFileList([file]));
            setFilePreview(URL.createObjectURL(file));
        }
    };

    return (
        <section>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{!bookId ? "Create" : "Update"}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard/books">
                                <Button variant={'outline'}>
                                    
                                    <span className="ml-2">Cancel</span>
                                </Button>
                            </Link>
                            
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <LoaderCircle className="animate-spin" />}
                                <span className="ml-2">Submit</span>
                            </Button>
                        </div>
                    </div>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>{!bookId ? "Create a new book" : "Edit book"}</CardTitle>
                            <CardDescription>Fill out the below to {!bookId ? "create" : "update"} a book</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input type="text" className="w-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="authorName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" className="w-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genre</FormLabel>
                                            <FormControl>
                                                <Input type="text" className="w-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea className="min-h-32" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {coverImagePreview && (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <img
                                                src={coverImagePreview}
                                                alt="Cover Preview"
                                                className="w-32 h-auto object-cover" // Adjust width and height
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                {filePreview && (
                                    <FormItem>
                                        <FormLabel>Book File</FormLabel>
                                        <FormControl>
                                            <a href={filePreview} target="_blank" rel="noopener noreferrer">View Book File</a>
                                        </FormControl>
                                    </FormItem>
                                )}
                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    onChange={handleCoverImageChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Book File</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    onChange={handleFileChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </section>
    );
}

export default CreateBook;
