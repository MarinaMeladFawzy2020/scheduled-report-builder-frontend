export interface Scheduler {
        cc: string,
        created_BY: string,
        email_BODY: string,
        email_SUBJECT: string,
        //last_TIME_RUN: string,
        recipients: string,
        report: {
          rep_ID: number,  
          rep_MODULE: string,
          rep_NAME: string,
          rep_SQL: string,
          rep_TYPE: string
        },
        sch_FREQ: string,  
        sch_FREQ_UNIT: string,
        sch_ID: number,
        sch_NAME: string,
        sch_START: string,
        sch_TIME: string
     
}
