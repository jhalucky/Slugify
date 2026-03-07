import mongoose from 'mongoose';
declare const Click: mongoose.Model<{
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
}, mongoose.Document<unknown, {}, {
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        slug: string;
        originalUrl: string;
        timestamp: NativeDate;
        visitorId?: string;
        referer?: string;
        ip?: string;
        userAgent?: string;
    }, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<{
        slug: string;
        originalUrl: string;
        timestamp: NativeDate;
        visitorId?: string;
        referer?: string;
        ip?: string;
        userAgent?: string;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, {
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    slug: string;
    originalUrl: string;
    timestamp: NativeDate;
    visitorId?: string;
    referer?: string;
    ip?: string;
    userAgent?: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Click;
